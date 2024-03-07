class FBPlayer {
    getID() {};
    getName() {};
    getPhoto() {};

}
export default class FBInstantMock {
    player = new FBPlayer();
	async exec(method: string, ...args: any[]): Promise<any> {
    }
    shareAsync({}) {
        return Promise.resolve();
    }
}
declare global {
    var FBInstant: FBInstantMock
}
window.FBInstant = window["FBInstant"] || new FBInstantMock();