import { Session } from "@wharfkit/session";

export function getChainId(session: Session) {
    if ( session.chain.id.equals("aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906") ) return "0x" + (17777).toString(16); // eos
    if ( session.chain.id.equals("73e4385a2708e6d7048834fbc1079f2fabb17b3c125b146af438971e90716c4d") ) return "0x" + (15557).toString(16); // jungle4
    return null;
}