import {Injectable} from "@nestjs/common";
import {ManagementClient} from "auth0";

@Injectable()
export class ManagementClientService {
    public managementClient: ManagementClient;

    constructor() {
        this.managementClient = new ManagementClient({
            domain: 'dev-tyu80romro64bab1.us.auth0.com',
            clientId: 'yJBuARpadXtYvsWpEf3Jq8C1FZMa2tfP',
            clientSecret: 'JzFGjk06UxwZio_Aw3UPU-4Dsj24xyrMB03f7o2bzA_AN-841F2bub-NfKuwHo5c',
            scope: "read:users create:users read:roles read:role_members",
            audience: 'https://dev-tyu80romro64bab1.us.auth0.com/api/v2/',
            tokenProvider: {
                enableCache: true,
                cacheTTLInSeconds: 10
            }
        });
    }
}