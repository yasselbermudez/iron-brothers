import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {GymProfileCards} from '../GymProfiles';
import { useAuth } from '../../AuthContext/auth-hooks';
import {MyGymProfile} from "../MyGymProfile";

function Gym() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!user) return 

  return (
    <main className="min-h-screen bg-slate-950">
        <Tabs defaultValue="myGymProfile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-900/50 border border-slate-700 text-white p-0 mb-2 sm:mb-4 lg:mb-6">
            <TabsTrigger value="myGymProfile" className="data-[state=active]:bg-slate-800 hover:bg-slate-800">
              Mi Perfil
            </TabsTrigger>
            <TabsTrigger value="gymProfiles" className="data-[state=active]:bg-slate-800 hover:bg-slate-800">
              Perfil Grupal
            </TabsTrigger>
          </TabsList>

          <TabsContent value="myGymProfile">
              <MyGymProfile userId={user.id} />
          </TabsContent>

          <TabsContent value="gymProfiles">  
              <GymProfileCards groupId={user?.group_id}/>
          </TabsContent>
        </Tabs>
    </main>
  );
}

export default Gym;