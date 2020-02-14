'use strict'
/*
// 1. layer is encrypted
// 2.layer
{
  "nick_name1":<encrypted_phone_book_data>,
  "nick_name1":<encrypted_phone_book_data>
}
// 3. layer
// {
  "full_name":"str",
  "phone_numbers":[
    {
      "type":"",
      "number":""
    }
  ]
  "address":"str",
  "description":"str"
}
*/

const PhoneNumberType = {
  mobil: 'mobil',
  home: 'home',
  office: 'office'
}

class PhoneBookNumber {
  /**
   * 
   * @param {string} phoneNumber 
   * @param {PhoneNumberType} ty 
   */
  constructor(phoneNumber, ty){
    this.phoneNumber = phoneNumber;
    this.ty = ty || PhoneNumberType.mobil;
  }
}

class PhoneBookContact extends SecretJson {
  
  constructor(encryptor,
    fullName,
    address,
    description,
    phoneNumbers
  ) {
    super(encryptor)
    let obj = {
      "fullName": fullName || "",
      "address": address || "",
      "description": description || "",
      "phoneNumbers": phoneNumbers || []
    }
    this.encrypt(obj)
  }
  /**
   * 
   * @param {PhoneBookNumber} phbNumber 
   */
  addPhoneNumber(phbNumber) {
    let obj = this.decrypt()
    obj.phoneNumbers.push(phbNumber)
    this.encrypt(obj)
  }
}
PhoneBookContact.fromEncrypted = function(encrypted, encryptor) {
  let phbContact = new PhoneBookContact(encryptor)
  phbContact.__encryptedContent = encrypted
  return phbContact
}

class PhoneBookFile extends SecretFile {
  constructor () {
    super()
    this.type = 'phb'
  }

  start () {
    return super.start()
  }

  stop () {
    return super.start()
  }

  getNickNames() {
    let layer2 = this.__getLayer2();
    return Object.keys(layer2);
  }

  addContact(nickName,
    fullName,
    address,
    description,
    phoneNumbers) {
    let contact = new PhoneBookContact(this.__contentEncryptor,
      fullName,
      address,
      description,
      phoneNumbers
    );
    let phbObj = this.__getLayer2()
    if ("undefined" !== typeof(phbObj[nickName])) {
      throw new ErrorObject("The contact has been already in the contact list")
    }
    phbObj[nickName] = Array.from(contact.getEncryptedContent())
    this.encrypt(JSON.stringify(phbObj))
  }
  
  /**
   * 
   * @param {string} nickName 
   */
  getContact(nickName) {
    let layer2 = this.__getLayer2()
    let contact = PhoneBookContact.fromEncrypted(Uint8Array.from(layer2[nickName]), this.__contentEncryptor)
    return contact.decrypt()
  }
  
  removeContact(nickName) {
    let layer2 = this.__getLayer2()
    if ( "undefined" === typeof(layer2[nickName])) {
      throw ErrorObject("Contact not found")
    }
    delete layer2[nickName]
    this.encrypt(JSON.stringify(layer2))
  }

  addPhoneNumber(nickName, phoneNumber) {
    let layer2 = this.__getLayer2()
    let contact = PhoneBookContact.fromEncrypted(Uint8Array.from(layer2[nickName]), this.__contentEncryptor)
    contact.addPhoneNumber(phoneNumber)
    layer2[nickName] = Array.from(contact.getEncryptedContent())
    this.encrypt(JSON.stringify(layer2))
  }

  __getLayer2() {
    let txt = this.decrypt().txt
    return JSON.parse(txt)
  }
  clear() {
    this.encrypt("{}")  
  }
}


PhoneBookFile.createEmptyPhonebook = 
/**
 * 
 * @param {string} password 
 */
function(password) {
  let phbFile = new PhoneBookFile();
  phbFile.setPassword(password, false);
  phbFile.setNameEncryptor(theEncryptor.fromHexString(theUserManager.__dirHash));
  phbFile.clear()
  return phbFile
}

function testPhoneBookFile() {
  let phb = PhoneBookFile.createEmptyPhonebook("almafa");
  phb.addContact("Pista", "Kis Pista", "1111. Budapest, Alma utca 2.","almafa")
  phb.addPhoneNumber("Pista", new PhoneBookNumber("06/30-232-1403"))
  let contacts = phb.getNickNames()
  console.log(contacts)
  let Pista = phb.getContact("Pista")
  console.log(Pista)
}