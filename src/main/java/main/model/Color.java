package main.model;

public class Color {

    private static String color;

    public static String getColor(){
        color = Math.round(100 + Math.random() * 155) + ", " + Math.round(100 + Math.random() * 155) + ", " + Math.round(100 + Math.random() * 155);
        return color;
    }
}
