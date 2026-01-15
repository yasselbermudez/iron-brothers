import { useEffect, useState } from 'react';
import { Search, Users, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from '../ui/input';
import type { Group, MemberUpdate } from '../../services/api.interfaces';
import apiService from '../../services/api.service';
import GroupCard from './GroupCard';
import { useToast } from '../../hooks/useToast';

interface GroupSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user_data: {
    user_name: string
    user_id: string
  }
  refreshUser: () => void
}

const GroupSearchDialog = ({ open, onOpenChange, user_data, refreshUser }: GroupSearchDialogProps) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);
  const [joiningGroup,setJoiningGroup] = useState(false)
   const {addToast} = useToast()

  useEffect(() => {
      fetchGroups();
  },[]);

  const fetchGroups = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getAllGroups();
      setGroups(response);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinGroup = async (groupId: string,password:string) => {
    if (!password.trim()) return
    const member_data: MemberUpdate = {
      user_name: user_data.user_name,
      user_id: user_data.user_id,
      password: password,
      remove: false
    }
    try{
      setJoiningGroup(true)
      await apiService.updateMemberGroup(groupId,member_data)
      addToast("Ahora eres parte del grupo")
    } catch(error){
      console.log("Error uniendose al grupo: ",error)
    } finally{
      onOpenChange(false);
      refreshUser()
    }
  };

  const filteredGroups = groups.filter(group => {
    const searchLower = searchTerm.toLowerCase();
    return (
      group.group_name.toLowerCase().includes(searchLower) ||
      group.created_by.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[90vh] text-white overflow-hidden bg-slate-950 rounded-xl border-slate-800">
        <DialogHeader className="border-b border-slate-700 pb-4">
          <DialogTitle className="text-2xl">Buscar Grupos</DialogTitle>
        </DialogHeader>
        {/* Search Bar */}
        <div className="py-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={20} />
            <Input
              type="text"
              placeholder="Buscar por nombre de grupo o creador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-900 border-slate-700 placeholder-slate-700"
            />
          </div>
        </div>

        {/* Groups List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex gap-1 text-md justify-center py-12 text-white">
              <><Loader2 className='animate-spin h-4 w-4 mt-1'/>Cargando grupos</>
            </div>
          ) : filteredGroups.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto text-slate-600 mb-4" size={48} />
              <p className="text-slate-400">
                {searchTerm ? 'No se encontraron grupos que coincidan con tu búsqueda' : 'No hay grupos disponibles'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredGroups.map((group) => 
                <GroupCard
                  group={group}  
                  handleJoinGroup={handleJoinGroup}
                  expandedGroupId={expandedGroupId}
                  joiningGroup={joiningGroup}
                  setExpandedGroupId={setExpandedGroupId}
                />
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GroupSearchDialog;