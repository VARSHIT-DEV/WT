import java.sql.*;
import java.util.Scanner;

public class CrudWithStatement {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        try {
            Class.forName("oracle.jdbc.driver.OracleDriver");
            Connection con = DriverManager.getConnection(
                "jdbc:oracle:thin:@localhost:1521:xe",
                "system",
                "manager"
            );
            Statement stmt = con.createStatement();

            boolean running = true;
            while (running) {
                System.out.println("\n1. Insert");
                System.out.println("2. Display All");
                System.out.println("3. Update");
                System.out.println("4. Delete");
                System.out.println("5. Exit");
                System.out.print("Choose: ");
                int choice = sc.nextInt();
                sc.nextLine(); // consume newline

                switch (choice) {
                    case 1:
                        System.out.print("Enter Name: ");
                        String name = sc.nextLine();
                        System.out.print("Enter Roll No: ");
                        int roll = sc.nextInt();
                        sc.nextLine();

                        String insertSQL = "INSERT INTO nocap VALUES ('" + name + "', " + roll + ")";
                        int rowsInserted = stmt.executeUpdate(insertSQL);
                        if (rowsInserted > 0) System.out.println("Record inserted.");
                        break;

                    case 2:
                        ResultSet rs = stmt.executeQuery("SELECT * FROM nocap");
                        System.out.println("Name\tRoll No");
                        while (rs.next()) {
                            System.out.println(rs.getString(1) + "\t" + rs.getInt(2));
                        }
                        rs.close();
                        break;

                    case 3:
                        System.out.print("Enter Roll No to update: ");
                        int rollUpdate = sc.nextInt();
                        sc.nextLine();
                        System.out.print("Enter new Name: ");
                        String newName = sc.nextLine();

                        String updateSQL = "UPDATE nocap SET name='" + newName + "' WHERE roll_no=" + rollUpdate;
                        int rowsUpdated = stmt.executeUpdate(updateSQL);
                        if (rowsUpdated > 0) System.out.println("Record updated.");
                        else System.out.println("No record found.");
                        break;

                    case 4:
                        System.out.print("Enter Roll No to delete: ");
                        int rollDelete = sc.nextInt();
                        sc.nextLine();

                        String deleteSQL = "DELETE FROM nocap WHERE roll_no=" + rollDelete;
                        int rowsDeleted = stmt.executeUpdate(deleteSQL);
                        if (rowsDeleted > 0) System.out.println("Record deleted.");
                        else System.out.println("No record found.");
                        break;

                    case 5:
                        running = false;
                        System.out.println("Goodbye!");
                        break;

                    default:
                        System.out.println("Invalid choice.");
                }
            }

            stmt.close();
            con.close();
            sc.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
