import { useEffect, useState } from 'react';
import { Search, Users, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from './ui/button';
import { Input } from './ui/input';
import type { Group, MemberUpdate } from '../services/api.interfaces';
import apiService from '../services/api.service';

interface GroupSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user_data: {
    user_name: string
    user_id: string
  }
  refreshUser: () => void
}

const GroupSearchDialog = ({ open, onOpenChange,user_data,refreshUser }: GroupSearchDialogProps) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (open) {
      fetchGroups();
    }
  }, [open]);

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

  const filteredGroups = groups.filter(group => {
    const searchLower = searchTerm.toLowerCase();
    return (
      group.group_name.toLowerCase().includes(searchLower) ||
      group.created_by.toLowerCase().includes(searchLower)
    );
  });

  const handleJoinGroup = async (groupId: string) => {
    if (password.trim()) {

      const member_data: MemberUpdate = {
        user_name: user_data.user_name,
        user_id: user_data.user_id,
        password: password,
        remove: false
      }

      await apiService.updateMemberGroup(groupId,member_data)
  
      
      setPassword('');
      setExpandedGroupId(null);
      onOpenChange(false);
      refreshUser()
    }
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroupId(expandedGroupId === groupId ? null : groupId);
    setPassword('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] text-white overflow-hidden bg-slate-950 border-slate-800 flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b border-slate-800">
          <DialogTitle className="text-2xl font-bold">Buscar Grupos</DialogTitle>
        </DialogHeader>

        {/* Search Bar */}
        <div className="px-6 py-4 border-b border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <Input
              type="text"
              placeholder="Buscar por nombre de grupo o creador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus-visible:ring-blue-500"
            />
          </div>
        </div>

        {/* Groups List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-slate-400">Cargando grupos...</p>
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
              {filteredGroups.map((group) => {
                const isExpanded = expandedGroupId === group.id;
                
                return (
                  <div
                    key={group.id}
                    className="rounded-lg border bg-slate-900 border-slate-800 overflow-hidden transition-all"
                  >
                    {/* Group Header */}
                    <div
                      onClick={() => toggleGroup(group.id)}
                      className="p-4 cursor-pointer hover:bg-slate-800 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-1">
                            {group.group_name}
                          </h3>
                          <p className="text-sm text-slate-400 mb-2">
                            Creado por <span className="text-blue-400">{group.created_by}</span>
                          </p>
                          <div className="flex items-center gap-1 text-sm text-slate-500">
                            <Users size={16} />
                            <span>{group.members.length} {group.members.length === 1 ? 'miembro' : 'miembros'}</span>
                          </div>
                        </div>
                        <div className="text-slate-400 ml-2">
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="p-4 pt-0 border-t border-slate-800">
                        <div className="bg-slate-950 rounded-lg p-4 space-y-3">
                          <p className="text-sm text-slate-400">
                            Ingresa la contraseña para unirte a este grupo
                          </p>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                            <Input
                              type="password"
                              placeholder="Contraseña del grupo"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleJoinGroup(group.id)}
                              className="pl-10 bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus-visible:ring-blue-500"
                              autoFocus
                            />
                          </div>
                          <Button
                            onClick={() => handleJoinGroup(group.id)}
                            disabled={!password.trim()}
                            className="w-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-600"
                          >
                            <Lock className="h-4 w-4 mr-2" />
                            Unirse al Grupo
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GroupSearchDialog;