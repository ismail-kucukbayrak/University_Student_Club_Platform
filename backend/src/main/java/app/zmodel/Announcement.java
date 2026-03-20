package app.zmodel;

public class Announcement {
    private int id;
    private String text;

    public Announcement(int id, String text) {
        this.id = id;
        this.text = text;
    }

    public int getId() { return id; }
    public String getText() { return text; }
}
