import { Session } from "@wharfkit/session";
import { getChain } from "./getChain.js";

export function getExplorer(session: Session, trx_id: string) {
    const chain = getChain(session);
    if (!chain) return trx_id;;
    if (["eos", "wax", "jungle4", "kylin"].includes(chain)) return `https://${chain}.eosq.eosnation.io/tx/${trx_id}`;
    if (["telos"].includes(chain)) return `https://explorer.telos.net/transaction/${trx_id}`;
    if (["ux"].includes(chain)) return `https://explorer.uxnetwork.io/tx/${trx_id}`;
    return trx_id;
}
