import { DottedSeparator } from "@/components/dotted-separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CreateWorkspaceForm = () => {
  return (
    <Card className="p-4 bg-white w-full h-full shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">
          Create a new workspace
        </CardTitle>
      </CardHeader>
      <DottedSeparator className="my-4" />
      <CardContent></CardContent>
    </Card>
  );
};

export default CreateWorkspaceForm;
