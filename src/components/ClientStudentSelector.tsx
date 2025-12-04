import { useNavigate } from "react-router-dom";
import { useFamily } from "@/contexts/FamilyContext";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export const ClientStudentSelector = () => {
  const navigate = useNavigate();
  const { 
    selectedFamily, 
    selectedStudent, 
    selectedClient,
    students, 
    clients,
    isNewModel,
    setSelectedStudent,
    setSelectedClient
  } = useFamily();

  if (!selectedFamily) return null;

  const handleBack = () => {
    navigate('/overview');
  };

  // Use clients if new model, otherwise students
  const items = isNewModel ? clients : students;
  const selectedItem = isNewModel ? selectedClient : selectedStudent;
  const selectedName = isNewModel 
    ? selectedClient?.client_name 
    : selectedStudent?.student_name;
  const selectedAvatar = isNewModel
    ? selectedClient?.avatar_url
    : selectedStudent?.profile_image_url || selectedStudent?.photo_url;

  const handleSelectionChange = (id: string) => {
    if (isNewModel) {
      const client = clients.find(c => c.id === id);
      if (client) setSelectedClient(client);
    } else {
      const student = students.find(s => s.id === id);
      if (student) setSelectedStudent(student);
    }
  };

  return (
    <div className="mb-6 space-y-4">
      <Button 
        variant="ghost" 
        onClick={handleBack}
        className="mb-2"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Overview
      </Button>

      {items.length > 1 && (
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium">Select Child:</label>
          <Select 
            value={selectedItem?.id} 
            onValueChange={handleSelectionChange}
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={selectedAvatar || ''} />
                    <AvatarFallback>
                      {selectedName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="flex items-center gap-2">
                    {selectedName}
                    {isNewModel && <CheckCircle2 className="h-3 w-3 text-primary" />}
                  </span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {items.map((item: any) => (
                <SelectItem key={item.id} value={item.id}>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage 
                        src={isNewModel ? item.avatar_url : (item.profile_image_url || item.photo_url)} 
                      />
                      <AvatarFallback>
                        {(isNewModel ? item.client_name : item.student_name)?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="flex items-center gap-2">
                      {isNewModel ? item.client_name : item.student_name}
                      {isNewModel && <CheckCircle2 className="h-3 w-3 text-primary" />}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};
