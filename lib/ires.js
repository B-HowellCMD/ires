// Importing modules for the terminal ui and sys info
let blessed = require('blessed'), contrib = require('blessed-contrib'), monitor = require('.monitor');
const { disconnect } = require('process');

let screen = blessed.screen(); // represents the terminal UI
let grid = new contrib.grid({ // grid layout for the UI
    rows: 12,
    cols: 12,
    screen: screen
})

let cpuLine = grid.set(0, 0, 4, 12, contrib.line, { // shows the cpu history 
    showNthLabel: 5,
    maxY: 100,
    label: 'CPU History',
    showLegend: true
});

let memLine =  grid.set(4, 0, 4, 8, contrib.line, { // shows the memory usage
    showNthLabel: 5,
    maxY: 100,
    label: 'Memory and Swap History',
    showLegend: true,
    legend: {
        width: 10,
    },
})

let memDonut = grid.set(4, 8, 2, 4, contrib.donut, { // Memory %
    radius: 8,
    arcWidth: 3,
    yPadding: 2,
    remainColor: 'black',
    label: 'Memory',
});

let swapDonut = grid.set(6 , 8, 2, 4, contrib.donut, { // Swap %
    radius: 8, 
    arcWidth: 3, 
    yPadding: 2,
    remainColor: 'black',
    label: 'Swap'
});

let netSpark = grid.set(8, 0, 2, 6, contrib.sparkline, { // Network history ()
    label: 'Network History',
    tags: true,
    style: {
        fg: 'blue',
    },
});

let diskDonut = grid.set(10, 0, 2, 6, contrib.donut, {
    radius: 8,
    arcWidth: 3,
    yPadding: 2,
    remainColor: 'black',
    label: 'Disk Usage'
});

let procTable = grid.set(8, 6, 4, 6, contrib.table, {
    keys: true,
    label: 'Processes',
    columnSpacing: 1,
    columnWidth: [7, 24, 7, 7],
});

procTable.focus();

screen.render();
screen.on('resize', function(a) { // attaches the different sys resources to their respective UI componets
    cpuLine.emit('attach');
    memLine.emit('attach');
    memDonut.emit('attach');
    swapDonut.emit('attach');
    netSpark.emit('attach');
    diskDonut.emit('attach');
    procTable.emit('attach');
});

screen.key(['escape', 'q', 'C-c'], function(ch, key) { // allows the user to exit
    return process.exit(0);
});

function init() {
    new monitor.Cpu(cpuLine);
    new monitor.Mem(memLine, memDonut, swapDonut);
    new monitor.Net(netSpark);
    new monitor.Disk(diskDonut);
    new monitor.Proc(procTable);
}

process.on('uncaughtException', function(err) {
    // just here to avoid the app closing in Windows when using unsupported sys res. 
});

module.exports = {
    init: init,
    monitor: monitor,
};