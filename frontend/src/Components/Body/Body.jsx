import React, { useState , useRef , useEffect } from "react";
import "./body.css";
import ajhu from "../../images/pfp.png";
import demo1 from "../../images/demo1.jpg";
import demo2 from "../../images/demo2.jpg";
import demo3 from "../../images/demo3.jpg";
import panda from "../../images/panda.jpg";
import { motion } from "framer-motion";
import { ColorRing } from "react-loader-spinner"
import axios from "axios";
// import res from "express/lib/response";


function Body() {
  const ref = useRef();
  const nav = useRef();
  const bodyvariants = {
    hidden: {
      x: "90vw",
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: { delay: 0.3, stiffness: 50, type: "spring", duration: 0.3 },
    },
    exit: {
      y: "-100vh",
      transition: { ease: "linear" },
    },
  };

  const [imageName, setImageName] = useState("");
  const [file, setFile] = useState(ajhu);
  const [, setStatus] = useState("");
  const [btn, setBtn] = useState(false);
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState("");
  const [prediction, setPrediction] = useState({
    Name: "",
    Causes: "",
    Cure: "",
    Symptoms: "",
    random: "",
  });
  const [error , setError] = useState("");
  const [predictshow , setPredictShow] = useState(true);
  const [loading , setLoading] = useState(true);
  const [isImage , setIsImage] = useState(false);
  const [display , setDisplay] = useState(false);

  const imageBtn = (e) => {
    setShow(false);
    // setMsg("");
    console.log(e.target.files);
    // console.log(lastpart);
    if(e.target.files[0] === undefined){
      setBtn(false);
      setFile(ajhu);
      setDisplay(false);
      // setIsImage(false);
    }
    else{
      const lastpart = (e.target.files[0]).name.split(".").pop();
      const lower_last = lastpart.toLowerCase();
      if(lower_last === "jpg" || lower_last === "jpeg" || lower_last === "png"){
        setIsImage(true);
        setDisplay(false);
        setFile(URL.createObjectURL(e.target.files[0]));
        setBtn(true);
      }
      else{
        setIsImage(false);
        setDisplay(true);
        setFile(panda);
      }
      // setIsImage(true);
    }
    // console.log((e.target.files[0]).name);
    // setFile(URL.createObjectURL(e.target.files[0]));
    setImageName(e.target.files[0]);
  };


  useEffect(() => {
    // return () => {
      nav.current.scrollIntoView();
    // };
  }, [prediction.random , error]);

  let api = "http://localhost:8000/start";

  const saveImage = (e) => {
    setLoading(false);
    // const form = file;
    let formData = new FormData();
    console.log(imageName);
    formData.append('meimage', imageName);

    // console.log(formData);
    axios.post(api, formData)
      .then((response) => {
      // setJson(response.json)
      const arr2 = response.data.split("__");
        const len = arr2.length;
        // console.log(typeof response.data);
        // console.log(Object.keys(response.data.prediction).length);
        if(len === 5){
          setMsg("Result");
          setPredictShow(true);
          setPrediction({
            Name: arr2[0],
            Symptoms: arr2[1],
            Causes: arr2[2],
            Cure: arr2[3],
            random: arr2[4],
          })
        }
        else{
          setPredictShow(false);
          setError(arr2[1]);
          setMsg(arr2[0]);
        }
        // console.log("hmmm")
        // console.log(response.data);
        // setStatus(response.data.message, "success");
        setLoading(true);
      })
      .catch((error) => {
        // console.log(photo);
        console.log(error);
        setStatus("Error while uploading image to server");
      });
    // setLoading(true);
    setShow(true);
  };


  return (
    <motion.div
      variants={bodyvariants}
      className="body"
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="body-left">
        <div className="leftbody">
          <h1>Upload your file</h1>
          <form className="inputs" id="form" ref={ref}>
            <input
              className="input-file"
              type="file"
              onChange={imageBtn}
              accept="image/jpeg, image/png, image/jpg"
              required
              name="meimage"
            />
          </form>
          <div className="image">
            <img className="img-prev" src={file} alt="preview of upload" />
          </div>

          {
            !isImage && display ? 
            <p className="alert">Please upload a image</p>
            :
            <>
            {
              loading ?
              <button
              onClick={saveImage}
              className={`${"submit-link"} ${btn && isImage && "display"}`}
              // disabled={dis}
            >
              Submit
            </button> : 
            <div className="load">
            <ColorRing
              visible={true}
              height="70"
              width="70"
              ariaLabel="blocks-loading"
              wrapperStyle={{}}
              wrapperClass="blocks-wrapper"
              colors={['var(--h1)', 'var(--h1)', 'var(--h1)', 'var(--h1)', 'var(--h1)' , "var(--h1)" ]}
            />
            </div>
            }
            </>
          }
        </div>
        <hr />
        <div className="rightbody">
          <h1>Instructions:</h1>
          <div className="demo">
            <figure className="demo-fig">
              <img className="demo-img" src={demo1} alt="visibility" />
              <figcaption>
                Affected part of the leaf should be visible
              </figcaption>
            </figure>
            <figure className="demo-fig">
              <img className="demo-img" src={demo2} alt="quality" />
              <figcaption>Photo quality should be decent</figcaption>
            </figure>
            <figure className="demo-fig">
              <img className="demo-img" src={demo3} alt="clear bg" />
              <figcaption>
                Leaf should be single/differentiable from the background
              </figcaption>
            </figure>
            <div className="iframe">
            <iframe
              title="YT link"
              src="https://youtube.com/embed/bieZ8k_s204"></iframe>
              <p className="figcaption">Watch the video for detailed instructions</p>
            </div>
          </div>
        </div>
      </div>
      <div className="body-right" ref={nav}>
        {show && (
          <div className="resultfromcnn" id="result">
            <h1>{msg}</h1>
            {
              predictshow &&
              <>
              <div className="resultname">
                <p><span>Name:</span> {prediction.Name}</p>
              </div>
              <div className="resultcause">
                <p><span>Causes:</span> {prediction.Causes}</p>
              </div>
              <div className="resultsymptom">
                <p><span>Symptoms:</span> {prediction.Symptoms}</p>
              </div>
              <div className="resultcure">
                <p><span>Cure:</span> {prediction.Cure}</p>
              </div>
              </>
            }
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default Body;
