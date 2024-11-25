import { StyleSheet, Text, TextProps, View } from "react-native";
import React from "react";
import { MotiView } from "moti";

type TickerListProps = {
    number: number;
    index: number;
}

const numbersToNice = [...Array(10).keys()];
const _stagger = 50;

const Tick = ({children, ...rest}: TextProps) => {
  return <Text {...rest} className="font-semibold text-primaryTextColor">
    {children}
  </Text>
}

const TickerList = ({ number, index }: TickerListProps) => {
  return (
    <View style={{ height: 35, overflow: "hidden", backgroundColor: "red" }}>
      <MotiView
        animate={{ translateY: -35 * number }}
        transition={{
            delay: index * _stagger,
            // damping: 10,
            // stiffness: 50
        }}
      >
        {numbersToNice.map((num, index) => {
          return (
            <Tick
              key={`number-${num}-${index}`}
              style={{
                fontWeight: 800,
                fontSize: 40,
                lineHeight: 39,
                fontVariant: ["tabular-nums"],
              }}
            >
              {num}
            </Tick>
          );
        })}
      </MotiView>
    </View>
  );
};

export default function TickerComp({ value, filterCategory }: { value: number, filterCategory: string }){

  const intNumber = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    // minimumFractionDigits: 0
  }).format(value);

  const splittedValue = intNumber.toString().split("");

  return (
    <View className="flex-row justify-center items-end">
      <Text className="text-xl font-extrabold capitalize text-primaryTextColor">
        {filterCategory === "all" ? "Total": filterCategory}{" "}
      </Text>
      <View className="flex flex-row flex-wrap items-end">
        {splittedValue.map((number, index) => {
          if (!isNaN(parseInt(number))) {
            return <TickerList index={index} key={index} number={parseInt(number)} />
            
          }
          return (
            <Tick key={index}>
              {number}
            </Tick>
          )
        })}
      </View>
    </View>
  );
};
