import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

record AudioEquipment(String brandModel, String type, double price, boolean inStock) {}

public class AudioInventoryManagement {

    public static void main(String[] args) {
        
        List<AudioEquipment> inventory = Arrays.asList(
            new AudioEquipment("JBL VTX A12", "Line Array", 4500.00, true),
            new AudioEquipment("Pioneer XDJ-RX3", "Controller", 2100.00, true),
            new AudioEquipment("RCF HDL 20-A", "Line Array", 1800.00, false),
            new AudioEquipment("QSC KS118", "Subwoofer", 1500.00, true),
            new AudioEquipment("Behringer DR110DSP", "Active Speaker", 250.00, true),
            new AudioEquipment("L-Acoustics K2", "Line Array", 6000.00, true)
        );

        List<String> reportNames = inventory.stream()
            .filter(AudioEquipment::inStock)
            .filter(e -> e.type().equals("Line Array") || e.type().equals("Subwoofer"))
            .filter(e -> e.price() > 1000.00)
            .map(AudioEquipment::brandModel)
            .sorted()
            .collect(Collectors.toList());

        double totalInvestment = inventory.stream()
            .filter(AudioEquipment::inStock)
            .filter(e -> e.type().equals("Line Array") || e.type().equals("Subwoofer"))
            .filter(e -> e.price() > 1000.00)
            .mapToDouble(AudioEquipment::price)
            .sum();

        System.out.println("--- Premium Inventory Report ---");
        System.out.println("Equipment ready for dispatch: " + reportNames);
        System.out.println("Total batch investment: $" + totalInvestment);
    }
}