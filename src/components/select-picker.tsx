"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "./ui/avatar";
interface SelectPickerProps {
  data: { id: string; name: string }[] | undefined;
  placeholder?: string;
  value: string | undefined;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string) => void;
}
const SelectPicker = ({
  data,
  value,
  placeholder = "Assignee task",
  onChange,
}: SelectPickerProps) => {
  return (
    <Select defaultValue={value} onValueChange={onChange}>
      <SelectTrigger className="w-full px-2">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {data?.map((member) => (
            <SelectItem key={member.id} value={member.id} className="h-12">
              <div className="!flex !flex-row justify-start items-center gap-x-2">
                <Avatar className="bg-blue-500 rounded-sm size-9">
                  <AvatarFallback className="font-medium text-lg uppercase text-white bg-blue-500">
                    {member.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{member.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectPicker;
