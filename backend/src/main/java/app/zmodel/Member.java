package app.zmodel;

public class Member {
    private int memberId;
    private String userId;
    private String fname;
    private String lname;
    private String phone;

    public Member(int memberId, String userId, String fname, String lname, String phone) {
        this.memberId = memberId;
        this.userId = userId;
        this.fname = fname;
        this.lname = lname;
        this.phone = phone;
    }

    public int getMemberId() { return memberId; }
    public String getUserId() { return userId; }
    public String getFname() { return fname; }
    public String getLname() { return lname; }
    public String getPhone() { return phone; }
}
