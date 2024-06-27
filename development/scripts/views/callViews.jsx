import {useContext} from "react";
import {P2PContext} from "../components/p2pContext";
import {BsTelephoneFill, BsTelephoneInbound} from "react-icons/bs";


export const CallSomeBodyView = ({ callInitialStatus}) => {
    const { callStatus, startCalling , setCallStatus , contactFound } = useContext( P2PContext );
    callInitialStatus = callInitialStatus.length > 0 ? callInitialStatus : callStatus ;

    const initCall = () => {
        let contact = $( 'input#contact-number' ).val();
        let onCall = $( 'input#contact-number' ).attr( 'disabled' ) ;
        if( onCall ){
            alert( 'Already on a call');
            return ;
        } if( contact.length <= 0 ){
            setCallStatus( "Enter A Number Please" );
            return ;
        } if( contact === window.getNumber() ){
            setCallStatus( "Nice Try" );
            return ;
        } $( 'input#contact-number' ).attr( "disabled" , true );
        startCalling( contact );
    }

    if( contactFound === -1 )
        $( 'input#contact-number' ).attr( "disabled" , false );

    return (
    <div className="col-12">
        <h3 className="h5 mb-4"> Call somebody </h3>
        <div className="input-group mb-4">
            <span className="input-group-text">+98-</span>
            <input className="form-control form-control-lg"
               type="tel" id="contact-number"
               placeholder="Contact Number" />
            <span className="input-group-text"
                  style={{cursor: "pointer"}}
                  onClick={() => initCall()}>
            <BsTelephoneFill style={{width: '1em', height: '1em'}}/>
        </span>
        </div>
        <h3 className="h5 mb-4">{callInitialStatus}</h3>
    </div>);
}

export const AnswerCallView = () => {

    const { answerCall , call } = useContext( P2PContext );

    return (
        <div className="col-xs-12">
            <h3 className="h5 mb-4">
                {call.name} is calling
            </h3>
            <button onClick={() => answerCall( call )}
                    className="btn btn-success btn-lg mb-4">
                <BsTelephoneInbound style={{width: '1em', height: '1em'}}/>
            </button>
        </div>
    );
}