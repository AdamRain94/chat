package main;

public class Color {

    private static String color;

    public static String getColor(){
        color = Math.round(150 + Math.random() * 105) + ", " + Math.round(150 + Math.random() * 105) + ", " + Math.round(150 + Math.random() * 105);
        return color;
    }
}
