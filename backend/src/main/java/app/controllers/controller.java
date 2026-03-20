package app.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import app.services.service;
import app.zmodel.Announcement;
import app.zmodel.Club;
import app.zmodel.Member;
import app.zmodel.Student;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class controller {

    private final service srv;

    public controller(service srv) {
        this.srv = srv;
    }

    
    
    // ---------------- STUDENT ---------------- //

    @PostMapping("/student/add")
    public int addStudent(
            @RequestParam String userid,
            @RequestParam String password,
            @RequestParam String fname,
            @RequestParam String lname,
            @RequestParam String phone) {

        return srv.addStudent(userid, password, fname, lname, phone);
    }

    @PostMapping("/student/delete")
    public int deleteStudent(
            @RequestParam String userid) {

        return srv.deleteStudent(userid);
    }

    @GetMapping("/student/get")
    public Student getStudent(@RequestParam String userid) {
        return srv.getStudent(userid);
    }

    @GetMapping("/students")
    public List<Student> listStudents() {
        return srv.listStudents();
    }

    @PostMapping("/student/login")
    public int studentLogin(
            @RequestParam String userid,
            @RequestParam String password) {

        return srv.checkStudentLogin(userid, password);
    }
    
    @GetMapping("/student/myClubs")
    public List<Club> listMyClubs(@RequestParam String userid) {
        return srv.listClubsOfStudent(userid);
    }


    
    
    // ---------------- CLUB ---------------- //

    @PostMapping("/club/add")
    public int addClub(
            @RequestParam String name,
            @RequestParam String info) {

        return srv.addClub(name, info);
    }

    @PostMapping("/club/delete")
    public int deleteClub(@RequestParam int id) {
        return srv.deleteClub(id);
    }

    @GetMapping("/clubs")
    public List<Club> listClubs() {
        return srv.listClubs();
    }

    @PostMapping("/club/addStudent")
    public int addStudentToClub(
            @RequestParam int clubId,
            @RequestParam String userid) {

        return srv.addStudentToClub(clubId, userid);
    }

    @PostMapping("/club/deleteStudent")
    public int deleteStudentFromClub(
            @RequestParam int clubId,
            @RequestParam String userid) {

        return srv.deleteStudentFromClub(clubId, userid);
    }

    @GetMapping("/club/isMember")
    public int isMember(
            @RequestParam int clubId,
            @RequestParam String userid) {

        return srv.studentIsMember(clubId, userid);
    }

    @GetMapping("/club/members")
    public List<Member> listMembers(@RequestParam int clubId) {
        return srv.listMembersOfClub(clubId);
    }

    
    
    // ---------------- ANNOUNCEMENT ---------------- //

    @PostMapping("/announcement/add")
    public int addAnnouncement(
            @RequestParam int clubId,
            @RequestParam String text) {

        return srv.addAnnouncement(clubId, text);
    }

    @GetMapping("/announcement/list")
    public List<Announcement> listAnnouncements(@RequestParam int clubId) {
        return srv.listAnnouncements(clubId);
    }

    
    
    // ---------------- AUTHORITY ---------------- //

    @PostMapping("/authority/login")
    public int authorityLogin(
            @RequestParam String id,
            @RequestParam String password) {

        return srv.checkAuthority(id, password);
    }
}
