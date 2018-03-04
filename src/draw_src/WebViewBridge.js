function writeParagraph(string){
  var para = document.createElement('p');
  para.appendChild(document.createTextNode(string));
  document.body.appendChild(para);
    //document.body.insertBefore(para, document.body.firstChild);
}
/**
 * Created by Guy Blank on 3/9/17.
 *
 *  This is a sample provides an API to send & receive messages to and from the React-Native WebView (using postMessage/onMessage WebView API).
 *
 *  webViewBridge.send('functionToInvoke', {mydata: 'test'}, function(){console.log('success')},function(){console.log('error')});
 *
 *  The API is designed to be similar to the Cordova exec API so migration to it should be almost seamless.
 *  The API also provides solution to a React-Native WebView bug in iOS which causes sending consecutive postMessage calls to override each other.
 *
 *  Handling message on the React-Native side:
 *   <WebView
 *       ref={webview => { this.myWebView = webview; }}
 *       onMessage={this.onWebViewMessage}
 *  />
 *
 *  onWebViewMessage(event) {
 *      // post back reply as soon as possible to enable sending the next message
 *      this.myWebView.postMessage(event.nativeEvent.data);
 *
 *      let msgData;
 *      try {
 *          msgData = JSON.parse(event.nativeEvent.data);
 *      }
 *      catch(err) {
 *          console.warn(err);
 *          return;
 *      }
 *
 *      // invoke target function
 *      const response = this[msgData.targetFunc].apply(this, [msgData]);
 *      // trigger success callback
 *      msgData.isSuccessfull = true;
 *      msgData.args = [response];
 *      this.myWebView.postMessage(msgData)
 *  }
 * 

// flow
Webview sends message -> Document store message promise, store message callbacks ->
React receives message -> React send original message -> 
Document receives original message -> message promise resolve ->
Document sends next message -> Document deletes message promise ->
React runs function from message -> 
React adds successful and response to Msgdata -> React sends updated Msgdata ->
Document receives updated message -> Document runs callbacks ->
Document deletes message callbacks
 */
(function(){

    var promiseChain = Promise.resolve();


    var promises = {};
    var callbacks = {};

   var init = function() {

       const guid = function() {
           function s4() {
               return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
           }
           return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
       }

       window.webViewBridge = {
           /**
            * send message to the React-Native WebView onMessage handler
            * @param targetFunc - name of the function to invoke on the React-Native side
            * @param data - data to pass
            * @param success - success callback
            * @param error - error callback
            */
           send: function(targetFunc, data, success, error) {
               success = success || function(){};
               error = error || function () {};

               var msgObj = {
                   targetFunc: targetFunc,
                   data: data || {},
                   msgId: guid(),
               };

               var msg = JSON.stringify(msgObj);

               promiseChain = promiseChain.then(function () {
                   return new Promise(function (resolve, reject) {
                       console.log("sending message " + msgObj.targetFunc);
                       //background(200, 204, 0);
                       promises[msgObj.msgId] = {resolve: resolve, reject: reject};
                       callbacks[msgObj.msgId] = {
                           onsuccess: success,
                           onerror: error
                       };

                       window.postMessage(msg);
                   })
               }).catch(function (e) {
                   console.error('rnBridge send failed ' + e.message);
               });
           },


       };

       window.document.addEventListener('message', function(e) {
          console.log("message received from react native");
          //writeParagraph("message received from react native")
           var message;
           try {
               message = JSON.parse(e.data)
               //writeParagraph(JSON.stringify(e.data))
           }
           catch(err) {
              //writeParagraph("failed to parse message from react-native " + err)
              //writeParagraph(e.data)
               //console.error("failed to parse message from react-native " + err);
               return;
           }


           //resolve promise - send next message if available
           // acknowledge that message was received
           if (promises[message.msgId]) {
               promises[message.msgId].resolve();
               //writeParagraph('resolve ' + message.msgId + ' promise')
               delete promises[message.msgId];
           }

           //trigger callback
           if (message.args && callbacks[message.msgId]) {
               if (message.isSuccessful) {
                   //writeParagraph('message is Successful')
                   console.log('callback ' + message.args)
                   callbacks[message.msgId].onsuccess.apply(null, message.args);
               }
               else {
                  //writeParagraph('message error')
                   callbacks[message.msgId].onerror.apply(null, message.args);
               }
               delete callbacks[message.msgId];
           }
          // Run functions on Web called from React
          // Target Function
          if(message.targetFunc){
            window[message.targetFunc].apply(this, [message.targetFuncData]);
          }

       });
   };

   init();
}());