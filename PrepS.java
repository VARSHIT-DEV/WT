import java.sql.*;
import java.util.Scanner;

public class SimpleCrud {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        try {
            Class.forName("oracle.jdbc.driver.OracleDriver");
            Connection con = DriverManager.getConnection(
                "jdbc:oracle:thin:@localhost:1521:xe", 
                "system",
                "manager"
            );

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

                        PreparedStatement psInsert = con.prepareStatement("INSERT INTO nocap VALUES (?, ?)");
                        psInsert.setString(1, name);
                        psInsert.setInt(2, roll);
                        psInsert.executeUpdate();
                        System.out.println("Inserted.");
                        psInsert.close();
                        break;

                    case 2:
                        Statement stmt = con.createStatement();
                        ResultSet rs = stmt.executeQuery("SELECT * FROM nocap");
                        while (rs.next()) {
                            System.out.println(rs.getString(1) + "\t" + rs.getInt(2));
                        }
                        rs.close();
                        stmt.close();
                        break;

                    case 3:
                        System.out.print("Enter Roll No to update: ");
                        int rollUpdate = sc.nextInt();
                        sc.nextLine();
                        System.out.print("Enter new Name: ");
                        String newName = sc.nextLine();

                        PreparedStatement psUpdate = con.prepareStatement("UPDATE nocap SET name=? WHERE roll_no=?");
                        psUpdate.setString(1, newName);
                        psUpdate.setInt(2, rollUpdate);
                        int updated = psUpdate.executeUpdate();
                        if (updated > 0)
                            System.out.println("Updated.");
                        else
                            System.out.println("No record found.");
                        psUpdate.close();
                        break;

                    case 4:
                        System.out.print("Enter Roll No to delete: ");
                        int rollDelete = sc.nextInt();
                        sc.nextLine();

                        PreparedStatement psDelete = con.prepareStatement("DELETE FROM nocap WHERE roll_no=?");
                        psDelete.setInt(1, rollDelete);
                        int deleted = psDelete.executeUpdate();
                        if (deleted > 0)
                            System.out.println("Deleted.");
                        else
                            System.out.println("No record found.");
                        psDelete.close();
                        break;

                    case 5:
                        running = false;
                        System.out.println("Bye!");
                        break;

                    default:
                        System.out.println("Invalid choice.");
                }
            }
            con.close();
            sc.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
