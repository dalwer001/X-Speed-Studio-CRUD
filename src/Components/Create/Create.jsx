import React, { useEffect, useState } from 'react';
import spin from '../../image/spinner.gif';

const Create = () => {
    //all kinds of hooks
    const [validStatus, setValidStatus] = useState(false);
    const [selectStatus, setSelectStatus] = useState(false);
    const [radioStatus, setRadioStatus] = useState(false);
    const [spinner, setSpinner] = useState(false);
    const [fieldName, setFieldName] = useState([]);
    const [userInfo, setUserInfo] = useState([]);
    const [radio, setRadio] = useState([]);
    const [submitted, setSubmitted] = useState([]);
    const [allField, setAllField] = useState([]);
    const [select, setSelect] = useState([]);
    const [genderValue, setGenderValue] = useState('');
    const [nameValue, setNameValue] = useState('');
    const [emailValue, setEmailValue] = useState('');
    const [detailsValue, setDetailsValue] = useState('');


    //For fetching the Api data
    useEffect(() => {
        fetch('http://localhost/api/get_form.php')
            .then(res => res.json())
            .then(data => setUserInfo(data.data.fields[0]))
    }, [])


    //For the name of field
    useEffect(() => {
        var fieldName = Object.keys(userInfo)
        setFieldName(fieldName)
    }, [userInfo])



    //For the values of field data
    useEffect(() => {
        var fieldData = Object.values(userInfo)
        setAllField(fieldData)
    }, [userInfo])



    //For the gender Select option
    useEffect(() => {
        const res = allField.find(allField => allField.type === 'select');

        if (res) {
            setSelect(res)
            setSelectStatus(true)
        }
        else {
            setSelectStatus(false)
        }

    }, [allField])


    //For the gender Radio option
    useEffect(() => {
        const radio = allField.find(allField => allField.type === 'radio');

        if (radio) {
            setRadio(radio)
            setRadioStatus(true)
        }
        else {
            setRadioStatus(false)
        }

    }, [allField])


    //Getting success messages
    useEffect(() => {
        fetch('http://localhost/api/submit_form.php')
            .then(res => res.json())
            .then(data => setSubmitted(data))
    }, [])


    //For submitting the form
    const handleSubmit = (e) => {

        e.preventDefault();

        //Sending data
        const CreateInfo = {
            user_name: nameValue,
            user_email: emailValue,
            details: detailsValue,
            user_gender: genderValue
        };

        if (validStatus) {
            const url = `http://localhost/api/submit_form.php`;
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(CreateInfo)
            })
            setSpinner(true);
        }


        //Showing success messages
        if (submitted.status) {
            for (let i = 0; i < submitted.messages.length; i++) {
                setTimeout(function () { alert(submitted.messages[i]); }, 1000);
            }
            e.target.reset();
            setTimeout(function () { setSpinner(false); }, 1000)
        }
    }



    //For form validation
    const handleBlur = (e) => {

        setGenderValue(e.target.value)
        let isFieldValid = true;
        if (e.target.name === "user_name") {
            isFieldValid = /^[A-Za-z ]+$/.test(e.target.value);
            setNameValue(e.target.value || '')
        }
        if (e.target.name === "user_email") {
            setEmailValue(e.target.value || '')
        }
        if (e.target.name === "details") {
            setDetailsValue(e.target.value || '')
        }

        if (isFieldValid) {
            setValidStatus(true)
        }
        else {
            setValidStatus(false)
            alert("Type only letters")
            e.target.value = '';
        }
    }




    var i = 0;

    return (

        <div className="container mt-5">
            <h3 className="text-center">Create</h3>
            <form onSubmit={handleSubmit}>

                {/* For the field name and field values for select type*/}
                {!radioStatus && <>
                    {allField.map(allField =>
                        <div className="form-group">
                            <label>{allField.title}</label>

                            <input
                                onBlur={handleBlur}
                                name={fieldName[i++]}
                                className={allField.html_attr.class}
                                data-something="anything, can be some json value too"
                                id={allField.html_attr.id}
                                defaultValue={allField.default}
                                placeholder={allField.title}
                                required={allField.required}
                                type={allField.type === 'select' ? 'hidden' : allField.type}
                            />
                        </div>)}
                </>}


                {/* For the field name and field values for radio type*/}
                {radioStatus && <>
                    {allField.map(allField =>
                        <div className="form-group">
                            <label>{allField.title}</label>

                            <input
                                onBlur={handleBlur}
                                name="user_gender"
                                className={allField.html_attr.class}
                                data-something="anything, can be some json value too"
                                id={allField.html_attr.id}
                                defaultValue={allField.default}
                                placeholder={allField.title}
                                required={allField.required}
                                type={allField.type === 'radio' ? 'hidden' : allField.type}
                            />
                        </div>)}
                </>}


                {/* For the Select option for gender */}
                {selectStatus &&
                    <div>
                        <select onBlur={handleBlur} name={select.title} id={select.html_attr.id} className={select.html_attr.class} >
                            {select.options.map(option =>
                                <option value={option.key}>{option.label}</option>
                            )}
                        </select>
                    </div>
                }


                {/* For the Radio option for gender */}
                {radioStatus &&
                    <div>
                        {radio.options.map(option =>
                            <>
                                <input
                                    onBlur={handleBlur}
                                    type={radio.type}
                                    id={radio.html_attr.id}
                                    className={radio.html_attr.class}
                                    name="user_gender"
                                    value={option.key}
                                    required
                                />

                                <label>{option.label}</label>
                                <br />
                            </>
                        )}
                    </div>
                }

                <br />

                {!spinner ?
                    <input className="btn btn-success mb-5" type="submit" value="Submit" />
                    :
                    <img style={{ height: '100px' }} src={spin} alt="" />
                }

            </form>
        </div >
    );
};

export default Create;