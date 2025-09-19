import java.sql.*;
import java.util.Scanner;

public class CrudWithCallableStatement {
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

                        CallableStatement csInsert = con.prepareCall("{call insert_nocap(?, ?)}");
                        csInsert.setString(1, name);
                        csInsert.setInt(2, roll);
                        csInsert.execute();
                        System.out.println("Record inserted.");
                        csInsert.close();
                        break;

                    case 2:
                        CallableStatement csSelect = con.prepareCall("{call get_all_nocap(?)}");
                        csSelect.registerOutParameter(1, OracleTypes.CURSOR);  // Oracle specific
                        csSelect.execute();

                        ResultSet rs = (ResultSet) csSelect.getObject(1);
                        System.out.println("Name\tRoll No");
                        while (rs.next()) {
                            System.out.println(rs.getString("name") + "\t" + rs.getInt("roll_no"));
                        }
                        rs.close();
                        csSelect.close();
                        break;

                    case 3:
                        System.out.print("Enter Roll No to update: ");
                        int rollUpdate = sc.nextInt();
                        sc.nextLine();
                        System.out.print("Enter new Name: ");
                        String newName = sc.nextLine();

                        CallableStatement csUpdate = con.prepareCall("{call update_nocap(?, ?)}");
                        csUpdate.setInt(1, rollUpdate);
                        csUpdate.setString(2, newName);
                        csUpdate.execute();
                        System.out.println("Record updated.");
                        csUpdate.close();
                        break;

                    case 4:
                        System.out.print("Enter Roll No to delete: ");
                        int rollDelete = sc.nextInt();
                        sc.nextLine();

                        CallableStatement csDelete = con.prepareCall("{call delete_nocap(?)}");
                        csDelete.setInt(1, rollDelete);
                        csDelete.execute();
                        System.out.println("Record deleted.");
                        csDelete.close();
                        break;

                    case 5:
                        running = false;
                        System.out.println("Goodbye!");
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
