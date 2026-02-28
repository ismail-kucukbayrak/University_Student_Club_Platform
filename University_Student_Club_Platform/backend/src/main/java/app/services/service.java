package app.services;

import java.util.List;

import org.springframework.stereotype.Service;

import app.repositories.repository;
import app.zmodel.Announcement;
import app.zmodel.Club;
import app.zmodel.Member;
import app.zmodel.Student;

@Service
public class service {

    private final repository repo;

    public service(repository repo) {
        this.repo = repo;
    }

    
    
    // ---------------- STUDENT ---------------- //

    public int addStudent(String userid, String password, String fname, String lname, String phone) {
        return repo.addStudent(userid, password, fname, lname, phone);
    }

    public int deleteStudent(String userid) {
        return repo.deleteStudent(userid);
    }

    public Student getStudent(String userid) {
        return repo.getStudent(userid);
    }

    public int checkStudentLogin(String userid, String password) {
        return repo.checkStudentLogin(userid, password);
    }

    public List<Student> listStudents() {
        return repo.listStudents();
    }
    
    public List<Club> listClubsOfStudent(String userid) {
        return repo.listClubsOfStudent(userid);
    }


    
    
    // ---------------- CLUB ---------------- //

    public int addClub(String name, String info) {
        return repo.addClub(name, info);
    }

    public int deleteClub(int id) {
        return repo.deleteClub(id);
    }

    public List<Club> listClubs() {
        return repo.listClubs();
    }

    public int addStudentToClub(int clubId, String userid) {
        return repo.addStudentToClub(clubId, userid);
    }

    public int deleteStudentFromClub(int clubId, String userid) {
        return repo.deleteStudentFromClub(clubId, userid);
    }

    public int studentIsMember(int clubId, String userid) {
        return repo.studentIsMember(clubId, userid);
    }

    public List<Member> listMembersOfClub(int clubId) {
        return repo.listMembersOfClub(clubId);
    }

    
    
    // ---------------- ANNOUNCEMENT ---------------- //

    public int addAnnouncement(int clubId, String text) {
        return repo.addAnnouncement(clubId, text);
    }

    public List<Announcement> listAnnouncements(int clubId) {
        return repo.listAnnouncements(clubId);
    }

    
    
    // ---------------- AUTHORITY ---------------- //

    public int checkAuthority(String id, String password) {
        return repo.checkAuthority(id, password);
    }
}
