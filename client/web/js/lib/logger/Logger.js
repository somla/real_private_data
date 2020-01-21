'use strict'

// From: https://stackoverflow.com/questions/21876461/difference-between-console-log-and-console-debug
if(!console.debug){
    console.debug = function() {
        if(!console.debugging) return;
        console.log.apply(this, arguments);
    };
}

class Logger
{
    constructor(
        overrideConsole /** = false */, 
        debugging, /** = false */
        messageDiv, /** = document.getElementById("messageDiv") */
        nowStr /** = a default function */
    ) {
        
        this.debugging =  debugging || false;
        this.messageDiv = messageDiv || document.getElementById("messageDiv");
        this.logs = [];

        this.nowStr = nowStr || function(now /** = Date */) {
            let addNull = function(x){
                return x<10?("0" + x.toString()):x.toString();
            };
            
            let year  = now.getFullYear().toString();
            let month = addNull(now.getMonth() + 1);
            let day   = addNull(now.getDay());
            
            let hour  = addNull(now.getHours());
            let mins  = addNull(now.getMinutes());
            let secs  = addNull(now.getSeconds());
            //return "["+year+"-"+month+"-"+day+" "+hour+":"+mins+":"+secs+"]";
            return "["+hour+":"+mins+":"+secs+"]"
        }

        this.console = {
            "debug" : console.debug,
            "warn"  : console.warn,
            "clear" : console.clear,
            "log"   : console.log,
            "info"  : console.info,
            "error" : console.error
        }
        if(overrideConsole)
            this.overrideConsole();
    }
    overrideConsole(){
        let self = this;
        for(let k in this.console){
            console[k] = function (){
                self[k].apply(self,arguments);
            };
        } 
    }
    _htmlWrite(now, loggerName, e, args){
        
        let logRowDiv = document.createElement("div");
        logRowDiv.classList.add(["logger" + loggerName, "logRowDiv"]);
        logRowDiv.innerText = this.nowStr(now) + " ";
        for(let i = 0; i < args.length; ++i) {
            //TODO: print e.trace somehow
            logRowDiv.innerText += " " + args[i];
        }
        this.messageDiv.appendChild(logRowDiv);
    }

    _write(loggerName, args){

        let now = new Date();
        let e =  new Error();
        
        [].unshift.apply(args, [ this.nowStr(now) ] );
        this.console[loggerName].apply(console, args);
        [].shift.apply(args);
        
        this._htmlWrite(now, loggerName, e, args);
        this.logs.push({"time":now,"stack":e.stack, "log":args})
    }


    assert() {
        //TODO:Implement
        //Writes an error message to the console if the assertion is false
    }
     
    clear() {
        this.console.clear();
        this.messageDiv.innerHTML = "";
        this.logs = [];
    }
     
    count() {
        //TODO:Implement
        //Logs the number of times that this particular call to count() has been called
    }
     
    error() {
        this._write("error", arguments);
    }
     
    group() {
        //TODO:Implement
        //Creates a new inline group in the console. This indents following console messages by an additional level, until console.groupEnd() is called
    }
     
    groupCollapsed() {
        //TODO:Implement
        //Creates a new inline group in the console. However, the new group is created collapsed. The user will need to use the disclosure button to expand it
    }
     
    groupEnd() {
        //TODO:Implement
        //Exits the current inline group in the console
    }
     
    info() {
        this._write("info", arguments);
    }
     
    log() {
        this._write("log", arguments);
    }
     
    table() {
        //TODO:Implement
        //Displays tabular data as a table
    }
     
    time() {
        //TODO:Implement
        //Starts a timer (can track how long an operation takes)
    }
     
    timeEnd() {
        //TODO:Implement
        //Stops a timer that was previously started by console.time()
    }
     
    trace() {
        //TODO:Implement
        //Outputs a stack trace to the console
    }
     
    warn() {
        this._write("warn", arguments);
    }
     
    debug() {
        if(this.debugging)
            this._write("debug", arguments);
    }
     
}

window.addEventListener("load",function(){
    window.theLogger = new Logger(true, theConfig.debug);
});