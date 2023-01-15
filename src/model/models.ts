import JSONModel from "sap/ui/model/json/JSONModel";
import BindingMode from "sap/ui/model/BindingMode";
import * as Device from "sap/ui/Device";

export default {
  createDeviceModel: () => {
    const oModel = new JSONModel(Device);
    oModel.setDefaultBindingMode(BindingMode.OneWay);
    return oModel;
  },

  createAvatarModel: () => {
    const avatarIconSrc =
      "https://upload.wikimedia.org/wikipedia/en/thumb/6/63/SM_Supermalls_logo_2022.svg/640px-SM_Supermalls_logo_2022.svg.png";

    const avatarIconPath = "./Images/SM_Logo.png";
    const avatarObject = {
      src: avatarIconSrc,
      path: avatarIconPath,
    };

    const avatarModel = new JSONModel(avatarObject);
    return avatarModel;
  },
};
