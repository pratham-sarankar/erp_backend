const sequelize = require('../config/database')
const {DataTypes} = require('sequelize');


const CallLog = sequelize.define("call_log",
    {
        vmSessionId: {
            // Application generated unique session ID
            type: DataTypes.STRING,
            unique: true,
        },
        clientCorrelationId: {
            // This is the Xchange ID generated at session level. This Is unique field used for searching the CDR logs in the UI
            type: DataTypes.STRING,
            unique: true,
        },
        customerId: {
            // This is the customer name field in the format stored by Airtel in system
            type: DataTypes.STRING,
        },
        startTime: {
            // This field captures real time date in Epoch Timestamp format.
            type: DataTypes.DATE,
        },
        endTime: {
            // This field captures real time date in Epoch Timestamp format.
            type: DataTypes.DATE,
        },
        callAnswerTime: {
            // This field captures real time date in Epoch Timestamp format of when the call is answered by the destination party
            type: DataTypes.DATE,
        },
        Duration: {
            // This is the summation of the caller fromWaiting time and network time taken for ring to trigger.
            // Format: numeric in milliseconds
            type: DataTypes.BIGINT,
        },
        fromWaitingTime: {
            // Duration for which the IVR was played i.e. Duration when the welcome tone started and till the time destination number picked the call. Format: numeric in milliseconds
            type: DataTypes.BIGINT,
        },
        conversationDuration: {
            // The duration between when the call was answered by Destination number AND the call ended. Format: numeric in milliseconds
            type: DataTypes.BIGINT,
        },
        overallCallStatus: {
            // This field indicates that call status between both the parties. E.g. Answered, Missed, Disconnected, Busy
            // Note: Missed is captured for no. switched off, Not Reachable and No Answer
            type: DataTypes.STRING,
        },
        hangUpStatus: {
            // This field is captured basis which party has disconnected the call. E.g.: Party A or Party B
            // If the call is disconnected by the system in events of call not answered or max retries are exhausted, this is captured as “SYSTEM_INITIATED”
            type: DataTypes.STRING,
        },
        hangupCause: {
            // Captures the cause of hangup.
            // E.g. If the call disconnected by the system after MaxTries are exhausted, it is captured as SYSTEM_INITIATED hung up.
            // In all other cases, user (either destination or caller) hangs up the call, this is captured USER_INITIATED.
            type: DataTypes.STRING,
        },
        callType: {
            // This field indicates whether the call is INBOUND or OUTBOUND
            // “Inbound” indicates that call session is formed post receiving call on Airtel provided number (Eg: Number masking)
            // “Outbound” indicates that session is formed post initiating call from Airtel CLI to Caller (Eg:- Click to Call)
            type: DataTypes.STRING,
        },
        callerId: {
            // In case of Outbound – this is fixed line no. from where the call has been initiated to the destination no. In case of Inbound – this is the no. to which the call has been landed on.
            type: DataTypes.STRING,
        },
        participantAddress: {
            // This field captures the Caller No. in case participantType is “To” and Destination No. when the participantType is “From”
            type: DataTypes.STRING,
        },
        participantType: {
            // This denotes “To” and “From” the participantAddress
            type: DataTypes.STRING,
        },
        audioURL: {
            // This field captures Sound File URL which can be played during the wait time of the call.
            type: DataTypes.STRING,
        },
        retryCount: {
            // Number of retries before call is picked up at caller no. or at destination no. end
            type: DataTypes.INTEGER,
        },
        recordingURL: {
            // URL from which user can fetch call recording. This is shared by the customer
            type: DataTypes.STRING,
        },
        displayCliDestination: {
            // Fixed Line number that is being used for initiating call to destination number
            type: DataTypes.STRING,
        },
        calledNumber: {
            // This is applicable for call type-> inbound,Number on which call has landed. This will be Airtel VN to which the caller (Party A) will dial i.e. incoming call to Airtel VN
            type: DataTypes.STRING,
        },
        callerNumber: {
            // participantType ‘From’ number
            type: DataTypes.STRING,
        },
        destinationNumber: {
            // participantType ‘To’. Number
            type: DataTypes.STRING,
        },
        callerNumberStatus: {
            // Action triggered for the call initiated to the caller no. E.g. Disconnected, NetworkError, NotReachable, Busy Noanswer, Removed, Answer,
            type: DataTypes.STRING,
        },
        callerNumberStatusDetails: {
            // sip code, cause code and description, status of party A (Answered, Not reachable etc.) such as “16 | 699 | Normal Call clearing| Busy”
            type: DataTypes.STRING,
        },
        callerDuration: {
            // This is total call duration. Sum of "fromWaitingTime"
            // and "conversation Duration" Format: numeric in milliseconds
            type: DataTypes.INTEGER,
        },
        destinationNumberStatus: {
            // Action triggered for the call initiated to the destination no. E.g. Disconnected, NetworkError, NotReachable, Busy, Noanswer, Removed, Answer
            type: DataTypes.STRING,
        },
        destinationNumberStatusDetails: {
            // sip code, cause code and description, status of party B (Answered, Not reachable etc.) such as “17 | 486 | User Busy | Busy"
            type: DataTypes.STRING,
        },
        billableDuration: {
            // This is billable duration of the caller. Sum of "fromWaitingTime"
            // and "conversation
            // Duration"
            // call type Inbound - conversation duration
            // Call type Outbound - from waiting time + 2* conversation duration Format: numeric in milliseconds
            type: DataTypes.INTEGER,
        },
        circleNameCaller: {
            // This field captures the circle from where the no. is registered
            type: DataTypes.STRING,
        },
        circleNameDestination: {
            // This field captures the circle to which the call is made
            type: DataTypes.STRING,
        },
        operatorNameCaller: {
            // This field captured the operator to which this no. is registered from
            type: DataTypes.STRING,
        },
        operatorNameDestination: {
            // This field captured the operator to which the destination no. is registered on
            type: DataTypes.STRING,
        }
    },
    {
        sequelize,
    },
);


module.exports = CallLog;