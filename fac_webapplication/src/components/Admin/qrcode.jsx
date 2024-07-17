import React,{useContext, useEffect, useState} from "react";
import { BrowserView, MobileView } from "react-device-detect";
import { IoIosAddCircleOutline } from "react-icons/io";
import { callAPi } from "../../services/UserService";
import { AuthContext } from "../Context/AuthContext";


import "./admin.scss"

const QrcodeView = () => {
    const [categoryOption,setCategoryDropboxOption] = useState(false);
    const [categoryDropboxItem,setCategoryDropboxItem] = useState("");
    const [deviceIDOption,setdeviceIDOption] = useState("");
    const { URL, authDispatch } = useContext(AuthContext);
    
    const dropboxItemContent = ["Esp","Equipment","Sensor"]
    let devices = []
    


    const handleCategoryOption=()=>{
        console.log("Category Option",categoryOption);
        setCategoryDropboxOption(!categoryOption);
    }
    const handleDeviceOption=()=>{
        console.log("Device Option",deviceIDOption);
        setdeviceIDOption(!deviceIDOption);
    }

    const chooseCategoryDropboxItem = (item = "")=>{
        setCategoryDropboxItem(item);
        handleCategoryOption();
    }
    const iscategoryDropboxItemNull = ()=>{
        return categoryDropboxItem === "";
    }

    const handleDeviceItem = ()=>{
        // console.log(`${URL}/data/getgenerateqrsensor/`);
        devices = callAPi("get",`${URL}/data/getgenerateqrsensor`,)
    }
   
    return(
        <div className="Fac_Admin_Web_Manager">
            <BrowserView className="Fac_Admin_Web_Manager_Qrcode">
                <div className="Fac_Admin_Web_Manager_Qrcode_Header">
                    <div className="Fac_Admin_Web_Manager_Qrcode_Header_Title">
                        Create QR code
                    </div>
                </div>
                <div className="Fac_Admin_Web_Manager_Qrcode_Body">
                    <div className="Fac_Admin_Web_Manager_Qrcode_Body_Content">
                        <div className="Fac_Admin_Web_Manager_Qrcode_Body_Content_Left">
                                <p className="Text">Category</p>
                                <div className="Fac_Admin_Web_Manager_Qrcode_Body_Content_Left_DropboxHeader" 
                                     onClick={()=>{handleCategoryOption()}}>
                                        {!iscategoryDropboxItemNull() ?(
                                            <p className="Fac_Admin_Web_Manager_Qrcode_Body_Content_Left_DropboxHeader_Content">
                                                {categoryDropboxItem}
                                            </p>):(<p/>)}
                                </div>
                                {
                                    categoryOption ? (   
                                                        <div className="Dropbox">
                                                        {dropboxItemContent.map((item,index)=>(
                                                            <div className="Dropbox_Item" key={index} onClick={()=>{chooseCategoryDropboxItem(item)}}>{item}</div>
                                                        ))}
                                                        </div>
                                                    ): (<div></div>)
                                }

                                <p className="Text ">Device ID</p>
                                <div className="Fac_Admin_Web_Manager_Qrcode_Body_Content_Left_DropboxHeader" onClick={()=>{handleDeviceOption()}}>
                                {
                                    deviceIDOption ? (   
                                                        <div className="Dropbox">
                                                        {dropboxItemContent.map((item,index)=>(
                                                            <div className="Dropbox_Item" key={index} onClick={()=>{handleDeviceItem()}}>{item}</div>
                                                        ))}
                                                        </div>
                                                    ): (<div></div>)
                                    
                                }
                                </div>
                                <div className="Button">
                                    <IoIosAddCircleOutline className="Icon"/>
                                    <p>Generate QR Code</p>
                                </div>
                            </div> 
                        <div className="Fac_Admin_Web_Manager_Qrcode_Body_Content_Right"/>
                    </div>
                </div>
            </BrowserView>
        </div>
    )
}

export default QrcodeView