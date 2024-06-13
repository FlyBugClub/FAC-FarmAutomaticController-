import react, { useState } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import { MdArrowBackIosNew } from "react-icons/md";
import { Navigate, useNavigate } from "react-router-dom";
import { TbMessageLanguage } from "react-icons/tb";
import { FiSettings, FiUserMinus } from "react-icons/fi";
import { BiCheckShield } from "react-icons/bi";
import { RiVipCrownLine, RiArrowDownSFill } from "react-icons/ri";

const User = ({ weatherState }) => {
    const navigate = useNavigate();
    const [language, setlanguage] = useState("English");
    const [languageState, setlanguageState] = useState(false);

    return (

        <div className="Fac_Home">
            <BrowserView className="Fac_Home_Web" style={weatherState ? { paddingLeft: "15px" } : { paddingLeft: "0px" }}>
                <div className="Fac_Home_Web_Usercontainer">
                    <div className="Fac_Home_Web_Addfarmcontainer_Title">
                        <MdArrowBackIosNew size={28} style={{ marginRight: "10px", paddingTop: "7px", cursor: "pointer" }} onClick={() => navigate(-1)} />
                        <div style={{ width: "100%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            User
                        </div>
                    </div>
                    <div className="Fac_Home_Web_Usercontainer_Body">
                        <div className="Fac_Home_Web_Usercontainer_Body_Userinfo">
                            <img className="Fac_Home_Web_Usercontainer_Body_Userinfo_Image" src="/icons/user.png" alt="" />
                            <div className="Fac_Home_Web_Usercontainer_Body_Userinfo_Name">
                                <div style={{ display: "flex", alignItems: "center" }}>

                                    Name: Đinh Quốc Cường
                                    <FiSettings size={20} style={{ marginLeft: "15px", paddingTop: "5px", cursor: "pointer" }} />
                                </div>
                                <div style={{ marginTop: "5px" }}>
                                    Email: tr6r20@gmail.com
                                </div>
                            </div>
                        </div>
                        <div className="Fac_Home_Web_Usercontainer_Body_Language">
                            <TbMessageLanguage size={26} style={{ marginRight: "30px", marginTop: "5px" }} /> Language:
                            <div className="Fac_Home_Web_Usercontainer_Body_Language_Options" onClick={() => setlanguageState(!languageState)}>
                                {language}
                                <RiArrowDownSFill size={22} style={{ marginLeft: "10px" }} />
                                {
                                    languageState ?
                                        <div className="Fac_Home_Web_Usercontainer_Body_Language_Options_Dropbox">
                                            <div className="Fac_Home_Web_Usercontainer_Body_Language_Options_Dropbox_Items" onClick={() => setlanguage("Vietnamese")}>
                                                Vietnamese
                                            </div>
                                            <div className="Fac_Home_Web_Usercontainer_Body_Language_Options_Dropbox_Items" onClick={() => setlanguage("English")}>
                                                English
                                            </div>
                                        </div>
                                        :
                                        <></>
                                }

                            </div>
                        </div>
                        <div className="Fac_Home_Web_Usercontainer_Body_Items">
                            <RiVipCrownLine size={25} style={{ marginRight: "30px", marginTop: "5px" }} /> Upgrade
                        </div>
                        <div className="Fac_Home_Web_Usercontainer_Body_Items">
                            <BiCheckShield size={26} style={{ marginRight: "30px", marginTop: "5px" }} /> Change password
                        </div>
                        <div className="Fac_Home_Web_Usercontainer_Body_Items">
                            <FiUserMinus size={26} style={{ marginRight: "30px", marginTop: "5px" }} /> Log out
                        </div>

                    </div>

                </div>

            </BrowserView>
            <MobileView>

            </MobileView>

        </div>
    );
};
export default User;