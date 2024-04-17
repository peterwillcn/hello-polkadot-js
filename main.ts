import '@polkadot/api-augment';
import { ApiPromise, Keyring, WsProvider } from "@polkadot/api";
import { EventRecord } from '@polkadot/types/interfaces/system';

async function connect(){
    const wsProvider = new WsProvider("ws://127.0.0.1:9944");
    const api = await ApiPromise.create({ provider: wsProvider, types: {} });
    await api.isReady;
    return api;
}

async function getMetadata(api: ApiPromise) {
    const metadata = await api.rpc.state.getMetadata();
    return metadata.toString();
}

async function subscribeTemplatePallet(api: ApiPromise) {
    await api.query.system.events((events: EventRecord[]) => {
        console.log("length: ", events.length);
        events.forEach((record: EventRecord) => {
            const { event, phase } = record;
            const types = event.typeDef;
            console.log("type: ", types);
            console.log("section: ", event.section);
            console.log("method: ", event.method);
            if (event.section === "template" && event.method === "something") {
                console.log(`template event method: ${event.section}.${event.method}`);
                event.data.forEach((data, index) => {
                    console.log(`parameter ${index}: ${data.toString()} types: ${types[index].type}`);
                });
            }
        });
    })
}

async function main() {
    const api = await connect();
    //const metadata = await getMetadata(api);
    //console.log("metadata:", metadata);
    await subscribeTemplatePallet(api);

}

main().catch(console.error);
