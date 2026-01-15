import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {GroupProfiles} from '../profile/GroupProfiles';
import { MyProfile } from "../profile/MyProfile";
import { useAuth } from "../../AuthContext/auth-hooks";

function Profiles() {
  
  const { user } = useAuth();

  if(!user) return  

  return (
        <Tabs defaultValue="myGymProfile">
          <TabsList className="
            text-slate-500 rounded-xl grid 
            sm:w-full grid-cols-2 bg-slate-900
            mx-2 mt-2
            sm:mx-0 sm:mb-0
            md:mb-0 md:mt-2
            lg:mt-4 lg:mb-2
          ">
            <TabsTrigger value="myGymProfile" className="data-[state=active]:text-white data-[state=active]:border-slate-700 rounded-xl hover:text-white">
              Mi Perfil
            </TabsTrigger>
            <TabsTrigger value="gymProfiles" className="data-[state=active]:text-white data-[state=active]:border-slate-700 rounded-xl hover:text-white">
              Perfil Grupal
            </TabsTrigger>
          </TabsList>
          <div className="bg-slate-900 border-t sm:border border-slate-700 sm:rounded-xl min-h-screen">
            <TabsContent value="myGymProfile" >
              <MyProfile user={user}/>
            </TabsContent>

            <TabsContent value="gymProfiles">  
                <GroupProfiles user={user}/>
            </TabsContent>
          </div>
        </Tabs>
  );
}

export default Profiles;