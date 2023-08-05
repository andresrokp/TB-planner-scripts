function tableWidgetIgnitionCellContent(){
    let url="https://www.sighums.com/wp-content/uploads/2019/01/sighumscenter.png"
    switch (value) {
        case 'true':
            url = "https://upload.wikimedia.org/wikipedia/commons/c/cf/Toggle_green.png";
            break;
        case 'false':
            url="https://upload.wikimedia.org/wikipedia/commons/2/21/Toggle_grey.png";
            break;
        default:
    }

    return `<img style="height:25px;" src="${url}"/>`;
}