import React, { useEffect, useState } from "react";
import './home.css';
import axios from 'axios';

export function Home(){


    // ADD IMAGE AND DESCRIPTION
    const [img,setImg] = useState('');
    const [desc,setDesc] = useState('');
    const handleChange = (e)=>{
        setImg(e.target.files[0]);
    }
    const handleDesc = (e)=>{
        setDesc(e.target.value);
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();

        var formdata = new FormData();
        formdata.append('photo',img)
        formdata.append('description',desc)

        const config = {
            headers:{
                "Content-Type":"multipart/form-data"
            }
        }

        const res = await axios.post("http://localhost:3012/addimg",formdata,config)
        console.log(res);
        window.location.reload();
 
    }

    //FETCH IMAGE
    const [datas,setDatas] = useState([])
    const getAllImage = async()=>{
        const result = await axios.get('http://localhost:3012/getimg',{
            headers:{
                "Content-Type":"application/json"
            }
        })
        setDatas(result.data)
    }
    useEffect(()=>{
        getAllImage();
    },[])
   
    //DELETE IMAGE
    const handleDelete = (id)=>{
        axios.delete('http://localhost:3012/dltimg/'+id)
        window.location.reload();
    }

    return(
        <>
        <div className="mainBgDiv p-3 bg-light ">
            <div className="bg-light">
                <h2 className="text-center bg-light brandname">Web Gallery</h2>
            </div>
            <div className="innerBgDiv p-3 rounded">
                <p className="text-center text-warning"> 
                    Dream Big !
                </p>
                <form encType="multipart/form-data" >
                    <div className="addImgDiv navbar row m-4">
                        <div className="inputDiv row p-3 w-75">
                            <div>
                                <input type="file" className="form-control" name="photo" onChange={handleChange}></input>
                                <br/>
                            </div>
                            <div>
                                <input type="text" className="form-control" placeholder="Enter Image Description" name="description" onChange={handleDesc}></input>
                            </div>
                        </div>
                        <div className="addBtnDiv text-end m-2 w-25">
                            <button className="btn btn-primary form-control p-4"  onClick={handleSubmit} >Add Image</button>
                        </div>
                    </div>
                </form>
                <div className="mainContentDiv row m-4">
                {datas.map((value,index)=>(
                    <>
                        <div className="imgDiv m-3 border p-1 card bg-light " style={{width:'22rem'}}  key={value.id}>
                            <img src={`http://localhost:3012/storage/${value.image}`} className="mx-auto card-img " alt="pic" height="100%" width="100%"></img>
                            <p className="m-1 p-1 text-center text-light bg-black rounded">{value.description}</p>
                            <div className="p-1 bg-light m-auto">
                                <button className="btn btn-outline-danger" onClick={()=>handleDelete(value.id)}>Delete</button>
                            </div>
                        </div>        
                    </>
                ))}
                </div>
            <div className="text-center">
                <a href="#" className="text-decoration-none text-light"><button className="btn btn-outline-light m-3">Back to Top</button></a>
            </div>
            </div>
        </div>
        <footer className="text-center">
            <p className="bg-light p-2"> JothiMurugan S</p>
        </footer>
        </>
        );
}