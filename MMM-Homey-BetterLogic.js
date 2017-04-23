/* global Module */

/* Magic Mirror
 * Module: MMM-Homey-BetterLogic
 *
 * By Dirk Melchers & Peter Baan
 * MIT Licensed.
 */

Module.register("MMM-Homey-BetterLogic",{

    // Default module config.
    defaults: {
        debug: false,
        updateInterval: 60 * 1000, 
        animationSpeed: 2 * 1000,
        initialLoadDelay: 0,
        sections: [
                    {
                        suffix: '',
                        digits: 0,
                        url: 'http://www.dirk-melchers.de/echo.php?text=42',
                    },  
        ],
        output: [
            ['The answer','@1']
        ],

    },
    // Define required scripts.
    getStyles: function() {
        return ["MMM-Homey-BetterLogic.css"];
    },
    
    getScripts: function() {
        return [
            this.file("node_modules/sprintf-js/dist/sprintf.min.js")
        ];
    },
    
    debugmsg: function(msg) {
        if (this.config.debug) {
            Log.info(msg);
        }
    },
    
    // Define start sequence.
    start: function() {
        Log.info("Starting module: " + this.name);
        
        this.debugVar = "";

        this.sections = this.config.sections;
        this.mappings = this.config.mappings;
        
        this.loaded = false;
        this.scheduleUpdate(this.config.initialLoadDelay);

        this.updateTimer = null;
        
        // store the REST results here
        this.sectionData = [];
    },

    // Override dom generator.
    getDom: function() {
        var self = this;

        this.debugmsg('MMM-Homey-BetterLogic: getDom');
        
        // create wrapper <div>
        var wrapper = document.createElement("div");
        
        // debug messages
        if (this.debugVar !== "") {
            wrapper.innerHTML = self.debugVar;
            wrapper.className = "dimmed light xsmall";
            return wrapper;
        }

        // Loading message
        if (!this.loaded) {
            wrapper.innerHTML = "MMM-Homey-BetterLogic Loading...";
            wrapper.className = "dimmed light small";
            return wrapper;
        }
        
        // create table
        var tableHTML=document.createElement("table");
        tableHTML.className="small";
        
        // loop over all output rows
        for (var row_id in self.config.output) {
            this.debugmsg('MMM-Homey-BetterLogic: getDom row='+row_id);
            
            var row = self.config.output[row_id];
            
            // create <tr>
            var tr = document.createElement("tr");
            tableHTML.appendChild(tr);

            // loop over all columns in this row
            for (var col_id in row) {
                var col = row[col_id];
                var td = document.createElement("td");

                // does the col match @[0-9]+?
                var data_ids = col.match(/^@(\d+)$/);

                // we have a regexp match - so don't show the col, but the sectionData in the right format
                if (data_ids !== null) {

                    // id of the section
                    var section_id = (data_ids[1])-1;
                    
                    // get value - process only if not undef
                    var value = self.sectionData[section_id];
                    if (typeof value !== 'undefined' ) {

                        // get format
                        var format = self.sections[section_id].format;
                        // fallback for old config
                        if (!format) {
                            var digits = self.sections[section_id].digits;
                            var suffix = self.sections[section_id].suffix;
                            format = "%."+digits+"f"+suffix;
                        }
                        
                        // get mapping
                        var mapping_name = self.sections[section_id].mapping;
                        if (mapping_name) {
                            mapping = self.mappings[mapping_name];
                            if (mapping) {
                                value = mapping[value];
                            }
                        }
    
                        // format column using sprintf
                        col_text = sprintf(format, value);
                    } else {
                        col_text = '...';
                    }
                    td.className="align-right";
                } else {
                    col_text = col;
                    td.className="align-left";
                }

                // set content and append to row
                td.innerHTML=col_text;
                tr.appendChild(td);
            }            
        }
        
        // append table to wrapper
        wrapper.appendChild(tableHTML);
        
        return wrapper;
    },


    getData: function() {

        var self = this;
        this.debugmsg('MMM-Homey-BetterLogic: getData');
        
        // loop over all sections
        for (var id in self.sections) {
            var section = self.sections[id];
            this.debugmsg('MMM-Homey-BetterLogic: getData section id: '+id);
            this.debugmsg('MMM-Homey-BetterLogic: IRL: http://'+this.config.homeyIp+'/api/app/net.i-dev.betterlogic/'+self.sections[id].betherLogicVariable);

            this.sendSocketNotification(
                'MMM_REST_REQUEST',
                {
                    id: id,
                    url: 'http://'+this.config.homeyIp+'/api/app/net.i-dev.betterlogic/'+self.sections[id].betherLogicVariable,
                    homeyBearerToken: this.config.homeyBearerToken
                }
            );
        }
        
        self.scheduleUpdate(self.updateInterval);
    },

    processResult: function(id, data) {

        // store the data in the sectionData array       
        this.sectionData[id] = data;
        
        this.debugmsg('MMM-Homey-BetterLogic: Process result section: ' + id);
        
        this.loaded = true;
        this.debugVar = "";
        
        this.updateDom(this.config.animationSpeed);
    },
    
    socketNotificationReceived: function(notification, payload) {
        if (notification === 'MMM_REST_RESPONSE' ) {
            this.debugmsg('received:' + notification);
            if(payload.data && payload.data.statusCode === 200){
                this.debugmsg("process result:"+payload.id+" data:"+payload.data.body);
                var bodyObject = JSON.parse(payload.data.body);
                this.debugmsg("Value:"+bodyObject.result.value);
                this.processResult(payload.id, bodyObject.result.value);
            }
        }
    },
    
    scheduleUpdate: function(delay) {
        var nextLoad = this.config.updateInterval;
        if (typeof delay !== "undefined" && delay >= 0) {
            nextLoad = delay;
        }

        var self = this;
        setTimeout(function() {
            self.getData();
        }, nextLoad);
        
    },

});
