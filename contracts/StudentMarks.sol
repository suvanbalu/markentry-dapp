// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StudentMarks {
    struct Student {
        uint256 rollNumber;
        string name;
        mapping(string => uint256) subjectMarks; // Mapping to store subject-specific marks
        bool exists;
    }

    address public owner;
    mapping(uint256 => Student) public students;

    event MarkUpdated(uint256 indexed rollNumber, string name, string subject, uint256 marks);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    function addOrUpdateMark(uint256 _rollNumber, string memory _name, string memory _subject, uint256 _marks) public onlyOwner {
        require(_rollNumber > 0, "Roll number must be greater than 0");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_subject).length > 0, "Subject name cannot be empty");

        Student storage student = students[_rollNumber];

        if (!student.exists) {
            student.rollNumber = _rollNumber;
            student.name = _name;
            student.exists = true;
        }

        student.subjectMarks[_subject] = _marks;

        emit MarkUpdated(_rollNumber, _name, _subject, _marks);
    }

    function getStudentMark(uint256 _rollNumber, string memory _subject) public view returns (string memory, uint256) {
        require(students[_rollNumber].exists, "Student not found");
        uint256 marks = students[_rollNumber].subjectMarks[_subject];
        return (students[_rollNumber].name, marks);
    }
}
