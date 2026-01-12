import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
// import "./stylesheets/styles.css";
import Select from "react-select";
import { jsx } from "react/jsx-runtime";


function App() {
    return(
<App>
    <name>
     Enter your name: <input name="myName"/>
    </name>
    <gender>
     Enter your gender: <input type="radio" name="myGender" value="male"/>
     <input type="radio" name="myGender" value="female"/>
     <input type="radio" name="myGender" value="they"/>
    </gender>
    <birthdate>
     Enter your birth date:<input type="date" name="birthDate"/>
    </birthdate>
    <birthtime>
     Enter your birth time:<input type="time" name="birthTime"/>
     <input type="checkbox" label="Click if birth time is unknown" name="unknown"/>
    </birthtime>
    <birthplace>
     Enter your birth place:<input name="birthPlace"/>
    </birthplace>
</App>
    )
}
  

export default App;
