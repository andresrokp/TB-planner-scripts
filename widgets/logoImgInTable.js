// cell content function script to insert logos instead of brand names in the atts table

let url="https://www.sighums.com/wp-content/uploads/2019/01/sighumscenter.png"
switch (value) {
    case 'AVIANCA':
        url = "https://www.sighums.com/Sig_images_cloud/images_app_menzies/aviancacargo_logo.png"
        break;
    case 'AEROUNION':
        url="https://www.sighums.com/Sig_images_cloud/images_app_menzies/aerounion_logo.png"
        break;
    case 'FEDEX':
        url="https://www.sighums.com/Sig_images_cloud/images_app_menzies/fedex_logo.png"
        break;
    default:
        
}

return `<img style="height:25px;" src="${url}"/>`;