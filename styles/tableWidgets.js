// function in timeseries table advanced tab, to return a style object depending on the 
// proximity of sta value of the 'rowData' to paint the backG

function rowStyle(){
    let style = {};
    let now = new Date();
    let timeDiff = rowData.sta - now.getTime()

    if ( timeDiff > 86400000)
        return {background: '#6495ED77' }
    if ( timeDiff < 0)
        return {background: '#00214777' }
    else return {background: '#4B008277' }
}