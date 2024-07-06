import {useContext} from "react";
import {BsTelephoneFill, BsTelephoneInbound} from "react-icons/bs";
import {AppContext} from "../components/appContext";


export const CallSomeBodyView = ({ callInitialStatus }) => {
    const { callStatus, startCalling , setCallStatus , contactFound , setStream } = useContext( AppContext );
    callInitialStatus = callInitialStatus.length > 0 ? callInitialStatus : callStatus ;

    const initCall = () => {
        let ContactNumber = $( 'input#contact-number' );
        let contact = ContactNumber.val();
        let onCall = ContactNumber.attr( 'disabled' ) ;
        if( onCall ){
            alert( 'Already on a call');
            return ;
        } if( contact.length <= 0 ){
            setCallStatus( "Enter A Number Please" );
            return ;
        } if( contact === window.getNumber() ){
            setCallStatus( "Nice Try" );
            return ;
        } ContactNumber.attr( "disabled" , true );
        startCalling(contact);
    }

    if( contactFound === -1 )
        $( 'input#contact-number' ).attr( "disabled" , false );

    return (
        <>
            <h5 className="h5 mb-4">
                Call somebody
            </h5>
            <div className="row mb-4 pt-1 ps-2 pe-2">
                <div className="input-group">
                    <span className="input-group-text text-primary">+98-</span>
                    <input className="form-control form-control-lg"
                       type="tel" id="contact-number"
                       placeholder="Contact Number" />
                    <span className="input-group-text btn btn-lg btn-success"
                          style={{cursor: "pointer"}}
                          onClick={() => initCall()}>
                        <BsTelephoneFill style={{width: '1em', height: '1em'}}/>
                    </span>
                </div>
            </div>
            <h3 className="h5 mb-4">{callInitialStatus}</h3>
        </>);
}

export const AnswerCallView = ({ startStreaming }) => {

    const { answerCall , call , setStream } = useContext( AppContext );

    const initAnswer = () => {
        // start streaming my mic/cam
        answerCall( call );
    }

    return (
        <>
            <h5 className="h5 mb-4">
                {call.name} is calling
            </h5>
            <button onClick={() => initAnswer()}
                    className="btn btn-success btn-lg mb-4">
                <BsTelephoneInbound style={{width: '1em', height: '1em'}}/>
            </button>
        </>);
}