FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,

);
// FilePond.setOptions(
//     {
//         stylePanelAspectRatio:50/10,
//         imageResizeTargetWidth:100,
//         imageResizeTargetHeight:50,
//     }
// )
FilePond.parse(document.body);