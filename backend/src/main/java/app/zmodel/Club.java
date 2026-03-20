package app.zmodel;

public class Club {
    private int id;
    private String name;
    private String info;

    public Club(int id, String name, String info) {
        this.id = id;
        this.name = name;
        this.info = info;
    }

    public int getId() { return id; }
    public String getName() { return name; }
    public String getInfo() { return info; }
}

