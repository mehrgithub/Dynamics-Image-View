function FormLoadHandler() {
    if (Xrm.Page.ui.getFormType() != 1) {
        Xrm.Page.data.entity.attributes.get('mtools_configurationguid').setValue(Xrm.Page.data.entity.getId());
    }
}