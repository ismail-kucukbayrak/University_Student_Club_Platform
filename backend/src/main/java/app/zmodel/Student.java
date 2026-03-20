package app.zmodel;

public class Student {

    private String userid;
    private String fname;
    private String lname;
    private String phone;

    public Student(String userid, String fname, String lname, String phone) {
        this.userid = userid;
        this.fname = fname;
        this.lname = lname;
        this.phone = phone;
    }

    // Getter'lar
    public String getUserid() { return userid; }
    public String getFname() { return fname; }
    public String getLname() { return lname; }
    public String getPhone() { return phone; }
}
