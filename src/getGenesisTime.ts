import { Session } from "@wharfkit/session";

export function getGenesisTime(session: Session) {
    if ( session.chain.id.equals("aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906") ) return "2023-04-05T02:18:09"; // eos
    if ( session.chain.id.equals("73e4385a2708e6d7048834fbc1079f2fabb17b3c125b146af438971e90716c4d") ) return "2023-03-23T02:00:19"; // jungle4
    return null;
}