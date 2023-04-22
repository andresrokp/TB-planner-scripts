// test for remote script loading inside a postprocessing function

function usingEmbededScriptTag(){
    let ans = ''
    let scriptElement = document.createElement('script')
    scriptElement.src = 'https://github.com/andresrokp/TB-planner-scripts/blob/master/widgets/fechaBacanaAttCard.js'
    scriptElement.onload = function(){
        ans = eval('fechaBacana')
    }
    document.head.appendChild(scriptElement);
    return ans;
}

