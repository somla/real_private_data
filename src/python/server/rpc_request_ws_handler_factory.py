import sys
import logging

from jsonrpcserver import methods, async_dispatch as dispatch
import tornado.websocket

from config import theConfig
from rpc_wrapper.rpc_wrapper import RPCWrapper
from .rpc_wrapper_factory import RPCWrapperFactory

if sys.version_info.major != 3:
    print("please use python3")

def RPCRequestWSHandlerFactory(rpc_wrapper: RPCWrapper):
    my_methods = RPCWrapperFactory(rpc_wrapper, methods.Methods())

    class RPCRequestWSHandler(tornado.websocket.WebSocketHandler):
        def open(self):
            logging.debug("WebSocket opened")

        async def on_message(self, message):
            request = message
            show_message = theConfig.show_rpc_message
            response = await dispatch(request, my_methods, basic_logging=show_message, debug=theConfig.debug )
            if show_message:
                logging.debug(response)
            if response.wanted:
                self.write_message(str(response))

        
        def on_close(self):
            logging.debug("WebSocket closed")


    return RPCRequestWSHandler
