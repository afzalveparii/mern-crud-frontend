/* eslint-disable eqeqeq */
import React, { useContext, useEffect, useState } from 'react'
import Card from "react-bootstrap/Card"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Select from 'react-select';
import Spiner from "../../components/Spiner/Spiner"
import { singleUsergetfunc,editfunc } from '../../services/Apis';
import { useNavigate, useParams } from 'react-router-dom';
import { updateData } from '../../components/context/ContextProvider';
import { ToastContainer } from "react-toastify"
import { BASE_URL } from '../../services/helper';

import 'react-toastify/dist/ReactToastify.css';
import "./edit.css"



const Edit = () => {

  const [inputdata, setInputData] = useState({
    fname: "",
    lname: "",
    email: "",
    phoneNumber: "",
    gender: "",
    address: ""
  });

  const [error, setError] = useState({});
  const [status, setStatus] = useState("Active");
  const [imgdata,setImgdata] = useState("");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");

  const {update,setUpdate} = useContext(updateData)

 const navigate = useNavigate();

  const [showspin, setShowSpin] = useState(true);

  const {id} = useParams();

  // status optios
  const options = [
    { value: 'Active', label: 'Active' },
    { value: 'InActive', label: 'InActive' },
  ];

  // setInput Value
  const setInputValue = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputdata, [name]: value })
  }

  // status set
  const setStatusValue = (e) => {
    setStatus(e.value)
  }

  // profile set
  const setProfile = (e) => {
    setImage(e.target.files[0])
  }

  

  const userProfileGet = async()=>{
    const response = await singleUsergetfunc(id);
    
    if(response.status === 200){
      setInputData(response.data)
      setStatus(response.data.status)
      setImgdata(response.data.profile)
    }else{
      console.log("error");
    }
  }
  
  const validateInputs = () => {
    let validationErrors = {};
    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const nameRegex = /^[a-zA-Z ]+$/;
    const addressRegex = /^[a-zA-Z0-9\s,'-]*$/;

    if (!inputdata.fname) {
      validationErrors.fname = 'First Name is required';
    } else if (!nameRegex.test(inputdata.fname)) {
      validationErrors.fname = 'First Name must contain only letters';
    }

    if (!inputdata.lname) {
      validationErrors.lname = 'Last Name is required';
    }else if (!nameRegex.test(inputdata.lname)) {
        validationErrors.lname = 'Last Name must contain only letters';
    }

    if (!inputdata.email) {
      validationErrors.email = 'Email Address is required';
    }else if (!emailRegex.test(inputdata.email)) {
        validationErrors.email = 'Invalid Email Address !';
    }

    if (!inputdata.phoneNumber) {
      validationErrors.phoneNumber = 'Phone Number is required';
    }else if (!phoneRegex.test(inputdata.phoneNumber)) {
        validationErrors.phoneNumber = 'Phone Number must contain only digits';
    }

    if (!inputdata.gender) { 
      validationErrors.gender = 'Gender is required';
    }

    if (!image) {
      validationErrors.user_profile = 'Profile image is required';
    }

    if (!inputdata.address) {
      validationErrors.address = 'Address is required';
    }else if (!addressRegex.test(inputdata.address)) {
        validationErrors.address = 'Invalid Address !';
    }
    // Add more validation rules as needed
    return validationErrors;
  };

  //submit userdata
  const submitUserData = async(e) => {
    e.preventDefault();

    const { fname, lname, email, phoneNumber, gender, address } = inputdata;

    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      return setError(validationErrors);
    }
  
    const data = new FormData();
    data.append("fname",fname)
    data.append("lname",lname)
    data.append("email",email)
    data.append("phoneNumber",phoneNumber)
    data.append("gender",gender)
    data.append("status",status)
    data.append("user_profile",image || imgdata)
    data.append("address",address)

    const config = {
      "Content-Type":"multipart/form-data"
    }

    const response = await editfunc(id,data,config);
    
    if(response.status === 200){
      setUpdate(response.data)
      navigate("/")
    }
  }

  useEffect(()=>{
    userProfileGet();
  },[id])

  useEffect(() => {
    if (image) {
      setImgdata("")
      setPreview(URL.createObjectURL(image))
    }
    setTimeout(() => {
      setShowSpin(false)
    }, 1200)
  }, [image]);



  return (
    <>
      {
        showspin ? <Spiner /> : <div className="container">
          <h2 className='text-center mt-1'>Update Your Details</h2>
          <Card className='shadow mt-3 p-3'>
            <div className="profile_div text-center">
              <img src={image ? preview : `${BASE_URL}/uploads/${imgdata}`} alt="img" />
            </div>

            <Form>
              <Row>
                <Form.Group className="mb-3 col-lg-6" controlId="formBasicFname">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control type="text" name='fname' value={inputdata.fname} onChange={setInputValue} placeholder='Enter First Name' isInvalid={!!error.fname} />
                  <Form.Control.Feedback type="invalid">
                    {error.fname}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3 col-lg-6" controlId="formBasicLname">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control type="text" name='lname' value={inputdata.lname} onChange={setInputValue} placeholder='Enter Last Name' isInvalid={!!error.lname}/>
                  <Form.Control.Feedback type="invalid">
                    {error.lname}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control type="email" name='email' value={inputdata.email} onChange={setInputValue} placeholder='Enter Email Address' isInvalid={!!error.email} />
                  <Form.Control.Feedback type="invalid">
                    {error.email}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3 col-lg-6" controlId="formBasicPhone">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control type="text" name='phoneNumber' value={inputdata.phoneNumber} onChange={setInputValue} placeholder='Enter Phone Number' isInvalid={!!error.phoneNumber} />
                  <Form.Control.Feedback type="invalid">
                    {error.phoneNumber}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3 col-lg-6" controlId="formBasicGender">
                  <Form.Label>Select Your Gender</Form.Label>
                  <Form.Check
                    type={"radio"}
                    label={`Male`}
                    name="gender"
                    value={"Male"}
                    checked={inputdata.gender == "Male" ? true:false}
                    onChange={setInputValue}
                    isInvalid={!!error.gender}
                  />
                  <Form.Check
                    type={"radio"}
                    label={`Female`}
                    name="gender"
                    value={"Female"}
                    checked={inputdata.gender == "Female" ? true:false}
                    onChange={setInputValue}
                    isInvalid={!!error.gender}
                  />
                  {error.gender && ( 
                    <Form.Text className="text-danger">
                      {error.gender}
                    </Form.Text>
                  )}
                </Form.Group>
                <Form.Group className="mb-3 col-lg-6" controlId="formBasicStatus">
                  <Form.Label>Select Your Status</Form.Label>
                  <Select options={options} defaultValue={status} onChange={setStatusValue} />
                </Form.Group>
                <Form.Group className="mb-3 col-lg-6" controlId="formBasicProfile">
                  <Form.Label>Select Your Profile</Form.Label>
                  <Form.Control type="file" name='user_profile' onChange={setProfile} placeholder='Select Your Profile' isInvalid={!!error.user_profile} />
                  <Form.Control.Feedback type="invalid">
                    {error.user_profile} 
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3 col-lg-6" controlId="formBasicAddress">
                  <Form.Label>Enter Your Address</Form.Label>
                  <Form.Control type="text" name='address' value={inputdata.address} onChange={setInputValue} placeholder='Enter Your Address' isInvalid={!!error.address} />
                  <Form.Control.Feedback type="invalid">
                    {error.address}
                  </Form.Control.Feedback>
                </Form.Group>
                <Button variant="primary" type="submit" onClick={submitUserData}>
                  Submit
                </Button>
              </Row>

            </Form>
          </Card>
          <ToastContainer position="top-center" />
        </div>
      }

    </>
  )
}

export default Edit