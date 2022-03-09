function Step(props) {
    return(
        <div className='container-step'>
            <h3 className='step-tittle'>{props.tittle}</h3>
            <p>
                {props.firstLine} 
            </p>
            <p>
                {props.secondLine} 
            </p>
            <p className={props.classThirdLine}>
                {props.thirdLine} 
            </p>
        </div>
    );
};

export default Step;