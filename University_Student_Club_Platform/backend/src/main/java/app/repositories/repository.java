package app.repositories;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import app.zmodel.Announcement;
import app.zmodel.Club;
import app.zmodel.Member;
import app.zmodel.Student;

@Repository
public class repository {

    private final JdbcTemplate jdbc;

    public repository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }



    // ---------------- STUDENT ---------------- //

    public int addStudent(String userid, String password, String fname, String lname, String phone) {
        String sql = "SELECT add_student(?, ?, ?, ?, ?)";
        return jdbc.queryForObject(sql, Integer.class, userid, password, fname, lname, phone);
    }
    
    public int deleteStudent(String userid) {
        String sql = "SELECT delete_student(?)";
        return jdbc.queryForObject(sql, Integer.class, userid);
    }
    
    public Student getStudent(String userId) {
        String sql = "SELECT * FROM get_student(?)";

        List<Student> list = jdbc.query(sql,
            (rs, rowNum) -> new Student(
                    rs.getString("userid"),
                    rs.getString("fname"),
                    rs.getString("lname"),
                    rs.getString("phone")
            ),
            userId
        );

        return list.isEmpty() ? null : list.get(0);
    }
    
    public int checkStudentLogin(String userId, String password) {
        String sql = "SELECT check_student_login(?, ?)";

        return jdbc.queryForObject(
            sql,
            Integer.class,
            userId,
            password
        );
    }
    
    public List<Student> listStudents() {
        String sql = "SELECT * FROM list_students()";

        return jdbc.query(sql, (rs, rowNum) -> 
            new Student(
                rs.getString("userid"),
                rs.getString("fname"),
                rs.getString("lname"),
                rs.getString("phone")
            )
        );
    }
    
    public List<Club> listClubsOfStudent(String userid) {
        String sql = "SELECT * FROM list_clubs_of_student(?)";

        return jdbc.query(
            sql,
            (rs, rowNum) -> new Club(
                rs.getInt("id"),
                rs.getString("name"),
                rs.getString("info")
            ),
            userid
        );
    }



    // ---------------- CLUB ---------------- //

    public int addClub(String name, String info) {
        String sql = "SELECT add_club(?, ?)";
        return jdbc.queryForObject(sql, Integer.class, name, info);
    }

    public int deleteClub(int id) {
        String sql = "SELECT delete_club(?)";
        return jdbc.queryForObject(sql, Integer.class, id);
    }
    
    public List<Club> listClubs() {
        String sql = "SELECT * FROM list_clubs()";

        return jdbc.query(
            sql,
            (rs, rowNum) -> new Club(
                    rs.getInt("id"),
                    rs.getString("name"),
                    rs.getString("info")
            )
        );
    }

    public int addStudentToClub(int clubId, String userid) {
        String sql = "SELECT add_student_to_club(?, ?)";
        return jdbc.queryForObject(sql, Integer.class, clubId, userid);
    }
    
    public int deleteStudentFromClub(int clubId, String userId) {
        String sql = "SELECT delete_student_from_club(?, ?)";
        return jdbc.queryForObject(sql, Integer.class, clubId, userId);
    }

    public int studentIsMember(int clubId, String userId) {
        String sql = "SELECT student_is_member(?, ?)";
        return jdbc.queryForObject(sql, Integer.class, clubId, userId);
    }

    public List<Member> listMembersOfClub(int clubId) {
        String sql = "SELECT * FROM list_members_of_club(?)";

        return jdbc.query(
            sql,
            (rs, rowNum) -> new Member(
                rs.getInt("member_id"),
                rs.getString("userid"),
                rs.getString("fname"),
                rs.getString("lname"),
                rs.getString("phone")
            ),
            clubId
        );
    }



    // ---------------- ANNOUNCEMENT ---------------- //

    public int addAnnouncement(int clubId, String text) {
        String sql = "SELECT add_announcement(?, ?)";
        return jdbc.queryForObject(sql, Integer.class, clubId, text);
    }
    
    public List<Announcement> listAnnouncements(int clubId) {
        String sql = "SELECT * FROM list_announcements(?)";

        return jdbc.query(
            sql,
            (rs, rowNum) -> new Announcement(
                rs.getInt("id"),
                rs.getString("text")
            ),
            clubId
        );
    }



    // ---------------- AUTHORITY ---------------- //

    public int checkAuthority(String id, String password) {
        String sql = "SELECT check_authority(?, ?)";

        return jdbc.queryForObject(
            sql,
            Integer.class,
            id,
            password
        );
    }

}