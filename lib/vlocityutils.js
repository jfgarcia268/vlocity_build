VlocityUtils = {
    showLoggingStatements: true,
    fullLog: [],
    namespace: '',
    verboseLogging: false,
    performance: false,
    startTime: Date.now(),
    silence: false,
    quiet: false,
    simpleLogging: false,
    noErrorLogging: false
};

VlocityUtils.log = function() {
    VlocityUtils.ipcsubtext(arguments);
    VlocityUtils.output(console.log, '\x1b[0m', arguments);
}

VlocityUtils.report = function() {
    VlocityUtils.ipcsubtext(arguments);
    VlocityUtils.output(console.log, '\x1b[36m', arguments);
}

VlocityUtils.success = function() {
    VlocityUtils.ipcsubtext(arguments);
    VlocityUtils.output(console.log, '\x1b[32m', arguments);
}

VlocityUtils.warn = function() {
    VlocityUtils.ipcsubtext(arguments);
    VlocityUtils.output(console.log, '\x1b[33m', arguments);
}

VlocityUtils.error = function() {
    VlocityUtils.ipcsubtext(arguments);
    VlocityUtils.output(console.warn, '\x1b[31m', arguments);
}

VlocityUtils.fatal = function() {
    VlocityUtils.output(console.warn, '\x1b[31m', arguments);

    throw arguments;
}

VlocityUtils.verbose = function() {
    if (VlocityUtils.verboseLogging) {
        VlocityUtils.output(console.log, '\x1b[0m', arguments);
    }
}

VlocityUtils.getTime = function() {
    var elapsedTime = (Date.now() - VlocityUtils.startTime) / 1000;

    return Math.floor((elapsedTime / 60)) + 'm ' + Math.floor((elapsedTime % 60)) + 's';
}

let ipcRendererSingleton;

VlocityUtils.getIPCRenderer = function() {

    if (ipcRendererSingleton === undefined) {
        if ('electron' in process.versions) {
            ipcRendererSingleton = require('electron').ipcRenderer;
        } else {
            ipcRendererSingleton = false;
        }
    }

    return ipcRendererSingleton;
}

VlocityUtils.milestone = function(message, subtext) {
    var ipcRenderer = VlocityUtils.getIPCRenderer();
    if (ipcRenderer) {
        ipcRenderer.send("ipc-log-message", { message: message });

        if (subtext) {
            ipcRenderer.send("ipc-log-subtext", { message: subtext });
        }
    } else {
        VlocityUtils.output(console.log, '\x1b[0m', arguments);
    }
}

VlocityUtils.ipcsubtext = function(messageArray) {

    var ipcRenderer = VlocityUtils.getIPCRenderer();
    if (ipcRenderer && !VlocityUtils.quiet) {
        
        var message = '';

        for (var i = 0; i < messageArray.length; i++) {
            message += messageArray[i] + ' ';
        }

        ipcRenderer.send("ipc-log-subtext", { message: message });
    }
}

VlocityUtils.output = function(loggingMethod, color, messageArray) {
    if (VlocityUtils.quiet || (VlocityUtils.silence && !VlocityUtils.verboseLogging)) return;

    if (!messageArray) {
        return;
    }

    if (VlocityUtils.noErrorLogging) {
        loggingMethod = console.log;
    }

    var neutralColor = '\x1b[0m';

    if (VlocityUtils.simpleLogging) {
        color = '';
        neutralColor = '';
    }

    var logSeperator = '>> ' + neutralColor;

    var newMessage;

    for (var i = 0; i < messageArray.length; i++) {

        if (i == 0) {
            newMessage = color + ' ';
        }

        if (i == 1) {
            newMessage += logSeperator;
        }

        if (messageArray[i] instanceof Error) {
            newMessage += messageArray[i].stack;
        } else if (typeof messageArray[i] == 'object') {
            newMessage += JSON.stringify(messageArray[i], null, 4);
        } else {
            newMessage += messageArray[i];
        }

        if ((i - 1) != messageArray.length) {
            newMessage += ' ';
        }
    }
    
    if (VlocityUtils.namespace == '') {
        newMessage = newMessage.replace(/%vlocity_namespace%__/g, '').replace(/%vlocity_namespace%/g, '');
    } else {
        newMessage = newMessage.replace(/%vlocity_namespace%/g, VlocityUtils.namespace);
    }
    
    if (VlocityUtils.showLoggingStatements) {
        loggingMethod((VlocityUtils.performance ? VlocityUtils.getTime() + ':' : ''), newMessage, neutralColor);
    }

    if (VlocityUtils.verboseLogging) {
        VlocityUtils.fullLog.push(newMessage.replace(color, '').replace(/\x1b\[0m/g, ''));
    }
}