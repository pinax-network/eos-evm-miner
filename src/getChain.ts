import { Session } from "@wharfkit/session";

export function getChain(session: Session) {
    if ( session.chain.id.equals("aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906") ) return "eos";
    if ( session.chain.id.equals("73e4385a2708e6d7048834fbc1079f2fabb17b3c125b146af438971e90716c4d") ) return "jungle4";
    if ( session.chain.id.equals("5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191") ) return "kylin";
    if ( session.chain.id.equals("1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4") ) return "wax";
    if ( session.chain.id.equals("f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12") ) return "waxtest";
    if ( session.chain.id.equals("4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11") ) return "telos";
    if ( session.chain.id.equals("1eaa0824707c8c16bd25145493bf062aecddfeb56c736f6ba6397f3195f33c9f") ) return "telostest";
    if ( session.chain.id.equals("8fc6dce7942189f842170de953932b1f66693ad3788f766e777b6f9d22335c02") ) return "ux";
    return null;
}