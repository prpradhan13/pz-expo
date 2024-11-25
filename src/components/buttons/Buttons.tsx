import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import Entypo from '@expo/vector-icons/Entypo';

type MainButtonProps = {
  btnName: string;
  isLoading?: boolean;
  onPress?: (e: any) => void;
  btnColor?: string;
  btnWidth?: string;
};

type SecondaryButtonProps = {
  btnName: string;
  isLoading?: boolean;
  onPress?: () => void;
};

export const MainButton = ({
  btnName,
  isLoading = false,
  onPress,
  btnColor,
  btnWidth
}: MainButtonProps) => {
  return (
    <TouchableOpacity
      onPress={isLoading ? undefined : onPress}
      className={`bg-${btnColor} w-[${btnWidth}] p-3 rounded-full flex justify-center items-center`}
      disabled={isLoading}
    >
      <Text
        style={{ fontSize: 16 }}
        className="text-primaryTextColor font-bold uppercase tracking-widest"
      >
        {isLoading ? <ActivityIndicator color="#F3ECEC" size={20} /> : btnName}
      </Text>
    </TouchableOpacity>
  );
};

export const SecondaryButton = ({
  btnName,
  isLoading = false,
  onPress
}: SecondaryButtonProps) => {

  return (
    <View>
      <TouchableOpacity
        onPress={onPress}
        className="w-full bg-borderColor p-2 rounded-lg flex flex-row shadow-[1px_3px_20px_-9px_rgba(255,138,101,1)]"
        disabled={isLoading}
      >
        <Entypo name="plus" size={20} color="#F3ECEC" />
        <Text
          className="text-primaryTextColor uppercase tracking-widest font-semibold"
        >
          {isLoading ? <ActivityIndicator color={"black"}/> : btnName}
        </Text>
      </TouchableOpacity>
    </View>
  )
};