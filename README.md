# Module: MMM-Homey-BetterLogic
The `MMM-Homey-BetterLogic` module is a <a href="https://github.com/MichMich/MagicMirror">MagicMirror</a> addon.
This module collects data from the Better Logic app from a Homey and displays it on your mirror in a table.

This project is a fork form <a href="https://github.com/Tuxdiver/MMM-Rest">MMM-REST</a> so credits to him.

## Installation
1. Navigate into your MagicMirror's 'modules' folder and execute 'git clone https://github.com/PBaan93/MMM-Homey-BetterLogic.git'
2. cd 'cd MMM-Homey-BetterLogic'
3. Execute 'npm install' to install the node dependencies.

## Known Issues
- had a problem with remote URLs an AJAX: changed to node_helper.js to collect data

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
    {
        module: 'MMM-Homey-BetterLogic',
        position: 'bottom_right',   // This can be any of the regions.
                                    // Best results in one of the side regions like: top_left
        header: 'Woonklimaat',      
        config: {
                debug: false,
                homeyIp: '192.168.1.2',
                homeyBearerToken : '1234567890abcdef1234567890abcdef',
                sections: [
                {
                    format: '%.1f<span class="wi wi-celsius"></span>',
                    betherLogicVariable: 'NestTemperatuur'
                },
                {
                    format: '%.1f<span class="wi wi-humidity"></span>',
                    betherLogicVariable: 'NestLuchtvochtigheid'
                }
            ],
            output: [
                ['Woonkamer','@1', '@2']
            ]
        }
    }
]
````

## Configuration options

The following properties can be configured:

<table width="100%">
    <!-- why, markdown... -->
    <thead>
        <tr>
            <th>Option</th>
            <th width="100%">Description</th>
        </tr>
    <thead>
    <tbody>
        <tr>
            <td valign="top"><code>sections</code></td>
            <td>sections is an array of hashes for the REST endpoints to connect to<br>
            <table>
                <thead>
                    <tr>
                        <th>Option</th>
                        <th width="100%">Description</th>
                    </tr>
                <thead>
                <tbody>
                    <tr>
                        <td valign="top"><code>format</code></td>
                        <td>sprintf() format</td>
                    </tr>
                    <tr>
                        <td valign="top"><code>mapping</code></td>
                        <td>Map the value againt a defined mapping</td>
                    </tr>
                    <tr>
                        <td valign="top"><code>url</code></td>
                        <td>The url to call. It has to return a single integer / floating point value</td>
                    </tr>
                </tbody>
            </table>
            </td>
        </tr>
        <tr>
            <td valign="top"><code>mappings</code></td>
            <td>mappings is an hash of hashes for the mapping of values to other values<br>
            <table>
                <thead>
                    <tr>
                        <th>Option</th>
                        <th width="100%">Description</th>
                    </tr>
                <thead>
                <tbody>
                    <tr>
                        <td valign="top"><code>NAME_OF_MAPPING</code></td>
                        <td>Name of mapping will be referenced by sections -> mapping</td>
                    </tr>
                    <tr>
                        <td valign="top"><code>values</code></td>
                        <td>hash of key / values to map from / to</td>
                    </tr>
                </tbody>
            </table>
            </td>
        </tr>
        <tr>
            <td valign="top"><code>output</code></td>
            <td>control the output table for the display.
            Has to be a 2-dimensional array representing the rows and the columns of the output<br>
            A cell containing a '@' followed by a number represents the section id (starting by 1) of the REST Urls
            </td>
        </tr>
        <tr>
            <td valign="top"><code>updateInterval</code></td>
            <td>How often this refreshes<br>
                <br><b>Example:</b> <code>60000</code>
                <br><b>Default value:</b> <code>60000</code>
            </td>
        </tr>
        <tr>
            <td valign="top"><code>initialLoadDelay</code></td>
            <td>How long to wait for the first load<br>
                <br><b>Example:</b> <code>60000</code>
                <br><b>Default value:</b> <code>0</code>
            </td>
        </tr>
        <tr>
            <td valign="top"><code>animationSpeed</code></td>
            <td>Fadeover effect for dom updates<br>
                <br><b>Example:</b> <code>1000</code>
                <br><b>Default value:</b> <code>2000</code>
            </td>
        </tr>
        <tr>
            <td valign="top"><code>debug</code></td>
            <td>Log messages to Log.info / console<br>
                <br><b>Example:</b> <code>true</code>
                <br><b>Default value:</b> <code>false</code>
            </td>
        </tr>
    </tbody>
</table>
